/*
    This file is part of Kismet

    Kismet is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    Kismet is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Kismet; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/

#ifndef __TRACKED_RRD_H__
#define __TRACKED_RRD_H__

#include "config.h"

#include <stdio.h>
#include <time.h>
#include <list>
#include <map>
#include <vector>
#include <algorithm>
#include <string>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <pthread.h>

#include "globalregistry.h"
#include "trackedelement.h"
#include "trackedcomponent.h"
#include "entrytracker.h"

// Aggregator class used for RRD.  Performs functions like combining elements
// (for instance, adding to the existing element, or choosing to replace the
// element), and for averaging to higher buckets (for instance, performing a 
// raw average or taking absolutes)
//
// For aggregators which skip empty values, the 'default' value can be used as 
// the 'empty' value (for instance, when aggregating temperature, a default value
// could be -99999 and the average function would ignore it)
class kis_tracked_rrd_default_aggregator {
public:
    // Performed when adding an element to the RRD.  By default, adds the new
    // value to the current value for aggregating multiple samples over time.
    static int64_t combine_element(const int64_t a, const int64_t b) {
        return a + b;
    }

    // Combine a vector for a higher-level record (seconds to minutes, minutes to 
    // hours, and so on).
    static int64_t combine_vector(std::shared_ptr<TrackerElementVectorDouble> e) {
        int64_t avg = 0;
        for (auto i : *e)
            avg += i;

        return avg / e->size();
    }

    // Default 'empty' value
    static int64_t default_val() {
        return (int64_t) 0;
    }

    static std::string name() {
        return "default";
    }
};

template <class Aggregator = kis_tracked_rrd_default_aggregator>
class kis_tracked_rrd : public tracker_component {
public:
    kis_tracked_rrd() :
        tracker_component() {
        register_fields();
        reserve_fields(NULL);
        update_first = true;
    }

    kis_tracked_rrd(int in_id) :
        tracker_component(in_id) {
        register_fields();
        reserve_fields(NULL);
        update_first = true;
    }

    kis_tracked_rrd(int in_id, std::shared_ptr<TrackerElementMap> e) :
        tracker_component(in_id) {

        register_fields();
        reserve_fields(e);
        update_first = true;

    }

    virtual uint32_t get_signature() const override {
        return Adler32Checksum("kis_tracked_rrd");
    }

    virtual std::unique_ptr<TrackerElement> clone_type() override {
        using this_t = typename std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t());
        return std::move(dup);
    }

    virtual std::unique_ptr<TrackerElement> clone_type(int in_id) override {
        using this_t = typename std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t(in_id));
        return std::move(dup);
    }

    // By default a RRD will fast forward to the current time before
    // transmission (this is desirable for RRD records that may not be
    // routinely updated, like records tracking activity on a specific 
    // device).  For records which are updated on a timer and the most
    // recently used value accessed (like devices per frequency) turning
    // this off may produce better results.
    void update_before_serialize(bool in_upd) {
        update_first = in_upd;
    }

    __Proxy(last_time, uint64_t, time_t, time_t, last_time);

    // Add a sample.  Use combinator function 'c' to derive the new sample value
    void add_sample(int64_t in_s, time_t in_time) {
        Aggregator agg;

        int sec_bucket = in_time % 60;
        int min_bucket = (in_time / 60) % 60;
        int hour_bucket = (in_time / 3600) % 24;

        time_t ltime = get_last_time();

        // The second slot for the last time
        int last_sec_bucket = ltime % 60;
        // The minute of the hour the last known data would go in
        int last_min_bucket = (ltime / 60) % 60;
        // The hour of the day the last known data would go in
        int last_hour_bucket = (ltime / 3600) % 24;

        if (in_time < ltime) {
            // printf("debug - rrd - timewarp to the past?  discard\n");
            return;
        }
        
        // If we haven't seen data in a day, we reset everything because
        // none of it is valid.  This is the simplest case.
        if (in_time - ltime > (60 * 60 * 24)) {
            // Directly fill in this second, clear rest of the minute
            for (auto i = minute_vec->begin(); i != minute_vec->end(); ++i) {
                if (i - minute_vec->begin() == sec_bucket)
                    *i = in_s;
                else
                    *i = agg.default_val();
            }

            // Reset the last hour, setting it to a single sample
            // Get the combined value for the minute
            int64_t min_val = agg.combine_vector(minute_vec);
            for (auto i = hour_vec->begin(); i != hour_vec->end(); ++i) {
                if (i - hour_vec->begin() == min_bucket)
                    *i = min_val;
                else
                    *i = agg.default_val();
            }

            // Reset the last day, setting it to a single sample
            int64_t hr_val = agg.combine_vector(hour_vec);
            for (auto i = day_vec->begin(); i != day_vec->end(); ++i) {
                if (i - day_vec->begin() == hour_bucket)
                    *i = hr_val;
                else
                    *i = agg.default_val();
            }

            set_last_time(in_time);

            return;
        } else if (in_time - ltime > (60*60)) {
            // printf("debug - rrd - been an hour since last value\n");
            // If we haven't seen data in an hour but we're still w/in the day:
            //   - Average the seconds we know about & set the minute record
            //   - Clear seconds data & set our current value
            //   - Average the minutes we know about & set the hour record
            //
           
            int64_t sec_avg = 0, min_avg = 0;

            // We only have this entry in the minute, so set it and get the 
            // combined value
            
            for (auto i = minute_vec->begin(); i != minute_vec->end(); ++i) {
                if (i - minute_vec->begin() == sec_bucket)
                    *i = in_s;
                else
                    *i = agg.default_val();
            }
            sec_avg = agg.combine_vector(minute_vec);

            // We haven't seen anything in this hour, so clear it, set the minute
            // and get the aggregate
            for (auto i = hour_vec->begin(); i != hour_vec->end(); ++i) {
                if (i - hour_vec->begin() == min_bucket)
                    *i = sec_avg;
                else
                    *i = agg.default_val();
            }
            min_avg = agg.combine_vector(hour_vec);

            // Fill the hours between the last time we saw data and now with
            // zeroes; fastforward time
            for (int h = 0; h < hours_different(last_hour_bucket + 1, hour_bucket); h++) {
                *(hour_vec->begin() + ((last_hour_bucket + 1 + h) % 24)) = agg.default_val();
            }

            *(day_vec->begin() + hour_bucket) = min_avg;

        } else if (in_time - ltime > 60) {
            // - Calculate the average seconds
            // - Wipe the seconds
            // - Set the new second value
            // - Update minutes
            // - Update hours
            // printf("debug - rrd - been over a minute since last value\n");

            int64_t sec_avg = 0, min_avg = 0;

            for (auto i = minute_vec->begin(); i != minute_vec->end(); ++i) {
                if (i - minute_vec->begin() == sec_bucket)
                    *i = in_s;
                else
                    *i = agg.default_val();
            }
            sec_avg = agg.combine_vector(minute_vec);

            // Zero between last and current
            for (int m = 0; 
                    m < minutes_different(last_min_bucket + 1, min_bucket); m++) {
                *(hour_vec->begin() + ((last_min_bucket + 1 + m) % 60)) = agg.default_val();
            }

            // Set the updated value
            *(hour_vec->begin() + min_bucket) = sec_avg;;

            min_avg = agg.combine_vector(hour_vec);

            // Reset the hour
            *(day_vec->begin() + hour_bucket) = min_avg;
        } else {
            // printf("debug - rrd - w/in the last minute %d seconds\n", in_time - last_time);
            // If in_time == last_time then we're updating an existing record,
            // use the aggregator class to combine it
            
            // Otherwise, fast-forward seconds with zero data, then propagate the
            // changes up
            if (in_time == ltime) {
                int64_t v = *(minute_vec->begin() + sec_bucket);
                *(minute_vec->begin() + sec_bucket) = agg.combine_element(v, in_s);
            } else {
                for (int s = 0; s < minutes_different(last_sec_bucket + 1, sec_bucket); s++) {
                    *(minute_vec->begin() + ((last_sec_bucket + 1 + s) % 60)) = agg.default_val();
                }

                *(minute_vec->begin() + sec_bucket) = in_s;
            }

            // Update all the averages
            int64_t sec_avg = 0, min_avg = 0;

            sec_avg = agg.combine_vector(minute_vec);

            // Set the minute
            *(hour_vec->begin() + min_bucket) = sec_avg;

            min_avg = agg.combine_vector(hour_vec);

            // Set the hour
            *(day_vec->begin() + hour_bucket) = min_avg;
        }

        set_last_time(in_time);
    }

    virtual void pre_serialize() override {
        tracker_component::pre_serialize();
        Aggregator agg;

        // printf("debug - rrd - preserialize\n");
        // Update the averages
        if (update_first) {
            add_sample(agg.default_val(), time(0));
        }
    }

protected:
    inline int minutes_different(int m1, int m2) const {
        if (m1 == m2) {
            return 0;
        } else if (m1 < m2) {
            return m2 - m1;
        } else {
            return 60 - m1 + m2;
        }
    }

    inline int hours_different(int h1, int h2) const {
        if (h1 == h2) {
            return 0;
        } else if (h1 < h2) {
            return h2 - h1;
        } else {
            return 24 - h1 + h2;
        }
    }

    inline int days_different(int d1, int d2) const {
        if (d1 == d2) {
            return 0;
        } else if (d1 < d2) {
            return d2 - d1;
        } else {
            return 7 - d1 + d2;
        }
    }

    virtual void register_fields() override {
        tracker_component::register_fields();

        RegisterField("kismet.common.rrd.last_time", "last time udpated", &last_time);

        RegisterField("kismet.common.rrd.minute_vec", "past minute values per second", &minute_vec);
        RegisterField("kismet.common.rrd.hour_vec", "past hour values per minute", &hour_vec);
        RegisterField("kismet.common.rrd.day_vec", "past day values per hour", &day_vec);

        RegisterField("kismet.common.rrd.blank_val", "blank value", &blank_val);
        RegisterField("kismet.common.rrd.aggregator", "aggregator name", &aggregator_name);

        second_entry_id = 
            RegisterField("kismet.common.rrd.second", 
                    TrackerElementFactory<TrackerElementInt64>(),
                    "second value");
        minute_entry_id = 
            RegisterField("kismet.common.rrd.minute", 
                    TrackerElementFactory<TrackerElementInt64>(),
                    "minute value");
        hour_entry_id = 
            RegisterField("kismet.common.rrd.hour", 
                    TrackerElementFactory<TrackerElementInt64>(),
                    "hour value", NULL);

    } 

    virtual void reserve_fields(std::shared_ptr<TrackerElementMap> e) override {
        tracker_component::reserve_fields(e);

        // Build slots for all the times
        int x;
        if ((x = minute_vec->size()) != 60) {
            for ( ; x < 60; x++) {
                minute_vec->push_back(0);
            }
        }

        if ((x = hour_vec->size()) != 60) {
            for ( ; x < 60; x++) {
                hour_vec->push_back(0);
            }
        }

        if ((x = day_vec->size()) != 24) {
            for ( ; x < 24; x++) {
                day_vec->push_back(0);
            }
        }

        Aggregator agg;
        (*blank_val).set(agg.default_val());
        (*aggregator_name).set(agg.name());

    }

    std::shared_ptr<TrackerElementUInt64> last_time;

    std::shared_ptr<TrackerElementVectorDouble> minute_vec;
    std::shared_ptr<TrackerElementVectorDouble> hour_vec;
    std::shared_ptr<TrackerElementVectorDouble> day_vec;

    std::shared_ptr<TrackerElementInt64> blank_val;
    std::shared_ptr<TrackerElementString> aggregator_name;

    int second_entry_id;
    int minute_entry_id;
    int hour_entry_id;

    bool update_first;
};

// Easier to make this it's own class since for a single-minute RRD the logic is
// far simpler.  In a perfect would this would be derived from the common
// RRD (or the other way around) but until it becomes a problem that's a
// task for another day.
template <class Aggregator = kis_tracked_rrd_default_aggregator >
class kis_tracked_minute_rrd : public tracker_component {
public:
    kis_tracked_minute_rrd() :
        tracker_component(0) {
        register_fields();
        reserve_fields(NULL);
        update_first = true;
    }

    kis_tracked_minute_rrd(int in_id) :
        tracker_component(in_id) {
        register_fields();
        reserve_fields(NULL);
        update_first = true;
    }

    kis_tracked_minute_rrd(int in_id, std::shared_ptr<TrackerElementMap> e) :
        tracker_component(in_id) {

        register_fields();
        reserve_fields(e);
        update_first = true;
    }

    virtual uint32_t get_signature() const override {
        return Adler32Checksum("kis_tracked_minute_rrd");
    }

    virtual std::unique_ptr<TrackerElement> clone_type() override {
        using this_t = typename std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t());
        return std::move(dup);
    }

    virtual std::unique_ptr<TrackerElement> clone_type(int in_id) override {
        using this_t = typename std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t(in_id));
        return std::move(dup);
    }

    // By default a RRD will fast forward to the current time before
    // transmission (this is desirable for RRD records that may not be
    // routinely updated, like records tracking activity on a specific 
    // device).  For records which are updated on a timer and the most
    // recently used value accessed (like devices per frequency) turning
    // this off may produce better results.
    void update_before_serialize(bool in_upd) {
        update_first = in_upd;
    }

    __Proxy(last_time, uint64_t, time_t, time_t, last_time);

    void add_sample(int64_t in_s, time_t in_time) {
        Aggregator agg;

        int sec_bucket = in_time % 60;

        time_t ltime = get_last_time();

        // The second slot for the last time
        int last_sec_bucket = ltime % 60;

        if (in_time < ltime) {
            return;
        }
        
        SharedTrackerElement e;

        // If we haven't seen data in a minute, wipe
        if (in_time - ltime > 60) {
            for (int x = 0; x < 60; x++) {
                *(minute_vec->begin() + x) = agg.default_val();
            }
        } else {
            // If in_time == last_time then we're updating an existing record, so
            // add that in.
            // Otherwise, fast-forward seconds with zero data, average the seconds,
            // and propagate the averages up
            if (in_time == ltime) {
                uint64_t v = *(minute_vec->begin() + sec_bucket);
                *(minute_vec->begin() + sec_bucket) = agg.combine_element(v, in_s);
            } else {
                for (int s = 0; s < minutes_different(last_sec_bucket + 1, sec_bucket); s++) {
                    *(minute_vec->begin() + ((last_sec_bucket + 1 + s) % 60)) = agg.default_val();
                }

                *(minute_vec->begin() + sec_bucket) = in_s;
            }
        }

        set_last_time(in_time);
    }

    virtual void pre_serialize() override {
        tracker_component::pre_serialize();
        Aggregator agg;

        if (update_first) {
            add_sample(agg.default_val(), time(0));
        }
    }

protected:
    inline int minutes_different(int m1, int m2) const {
        if (m1 == m2) {
            return 0;
        } else if (m1 < m2) {
            return m2 - m1;
        } else {
            return 60 - m1 + m2;
        }
    }

    virtual void register_fields() override {
        tracker_component::register_fields();

        RegisterField("kismet.common.rrd.last_time", "last time udpated", &last_time);

        RegisterField("kismet.common.rrd.minute_vec", "past minute values per second", &minute_vec);

        second_entry_id = 
            RegisterField("kismet.common.rrd.second", 
                    TrackerElementFactory<TrackerElementInt64>(),
                    "second value");

        RegisterField("kismet.common.rrd.blank_val", "blank value", &blank_val);
        RegisterField("kismet.common.rrd.aggregator", "aggregator name", &aggregator_name);
    } 

    virtual void reserve_fields(std::shared_ptr<TrackerElementMap> e) override {
        tracker_component::reserve_fields(e);

        set_last_time(0);

        // Build slots for all the times
        int x;
        if ((x = minute_vec->size()) != 60) {
            for ( ; x < 60; x++) {
                minute_vec->push_back(0);
            }
        }

        Aggregator agg;
        (*blank_val).set(agg.default_val());
        (*aggregator_name).set(agg.name());
    }

    std::shared_ptr<TrackerElementUInt64> last_time;
    std::shared_ptr<TrackerElementVectorDouble> minute_vec;
    std::shared_ptr<TrackerElementInt64> blank_val;
    std::shared_ptr<TrackerElementString> aggregator_name;

    int second_entry_id;

    bool update_first;
};

// Signal level RRD, peak selector on overlap, averages signal but ignores
// empty slots
class kis_tracked_rrd_peak_signal_aggregator {
public:
    // Select the stronger signal
    static int64_t combine_element(const int64_t a, const int64_t b) {
        if (a < b)
            return b;
        return a;
    }

    // Select the strongest signal of the bucket
    static int64_t combine_vector(std::shared_ptr<TrackerElementVectorDouble> e) {
        int64_t avg = 0, avgc = 0;

        for (auto i : *e) {
            int64_t v = i;

            if (v == 0)
                continue;

            avg += v;
            avgc++;
        }

        if (avgc == 0)
            return default_val();

        return avg / avgc;
    }

    // Default 'empty' value, no legit signal would be 0
    static int64_t default_val() {
        return (int64_t) 0;
    }

    static std::string name() {
        return "peak_signal";
    }
};

// Generic RRD, extreme selector.  If both values are > 0, selects the highest.
// If both values are below zero, selects the lowest.  If values are mixed,
// selects the lowest
class kis_tracked_rrd_extreme_aggregator {
public:
    // Select the most extreme value
    static int64_t combine_element(const int64_t a, const int64_t b) {
        if (a < 0 && b < 0) {
            if (a < b)
                return a;

            return b;
        } else if (a > 0 && b > 0) {
            if (a > b)
                return a;

            return b;
        } else if (a == 0) {
            return b;
        } else if (b == 0) {
            return a;
        } else if (a < b) {
            return a;
        }

        return b;
    }

    // Simple average
    static int64_t combine_vector(std::shared_ptr<TrackerElementVectorDouble> e) {
        int64_t avg = 0;

        for (auto i : *e) 
            avg += i;

        return avg / e->size();
    }

    // Default 'empty' value, no legit signal would be 0
    static int64_t default_val() {
        return (int64_t) 0;
    }

    static std::string name() {
        return "extreme";
    }
};


#endif

