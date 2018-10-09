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

#ifndef __TRACKEDLOCATION_H__
#define __TRACKEDLOCATION_H__

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

#include "globalregistry.h"
#include "trackedelement.h"
#include "trackedcomponent.h"
#include "entrytracker.h"

class kis_gps_packinfo;

// Component-tracker common GPS element
class kis_tracked_location_triplet : public tracker_component {
public:
    kis_tracked_location_triplet();
    kis_tracked_location_triplet(int in_id);
    kis_tracked_location_triplet(int in_id, std::shared_ptr<TrackerElementMap> e);

    virtual std::unique_ptr<TrackerElement> clone_type() override {
        using this_t = std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t());
        return std::move(dup);
    }

    virtual std::unique_ptr<TrackerElement> clone_type(int in_id) override {
        using this_t = std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t(in_id));
        return std::move(dup);
    }

    // Use proxy macro to define get/set
    __Proxy(lat, double, double, double, lat);
    __Proxy(lon, double, double, double, lon);
    __Proxy(alt, double, double, double, alt);
    __Proxy(speed, double, double, double, spd);
    __Proxy(heading, double, double, double, heading);
    __Proxy(fix, uint8_t, uint8_t, uint8_t, fix);
    __Proxy(valid, uint8_t, bool, bool, valid);
    __Proxy(time_sec, uint64_t, time_t, time_t, time_sec);
    __Proxy(time_usec, uint64_t, uint64_t, uint64_t, time_usec);

    void set(double in_lat, double in_lon, double in_alt, unsigned int in_fix);

    void set(double in_lat, double in_lon);

    void set(kis_gps_packinfo *in_packinfo);

	inline kis_tracked_location_triplet& operator= (const kis_tracked_location_triplet& in);

protected:
    virtual void register_fields() override;

    std::shared_ptr<TrackerElementDouble> lat;
    std::shared_ptr<TrackerElementDouble> lon;
    std::shared_ptr<TrackerElementDouble> alt;
    std::shared_ptr<TrackerElementDouble> spd;
    std::shared_ptr<TrackerElementDouble> heading;
    std::shared_ptr<TrackerElementUInt8> fix;
    std::shared_ptr<TrackerElementUInt8> valid;
    std::shared_ptr<TrackerElementUInt64> time_sec;
    std::shared_ptr<TrackerElementUInt64> time_usec;
};

// min/max/avg location
class kis_tracked_location : public tracker_component {
public:
    const static int precision_multiplier = 10000;

    kis_tracked_location();
    kis_tracked_location(int in_id);
    kis_tracked_location(int in_id, std::shared_ptr<TrackerElementMap> e);

    virtual std::unique_ptr<TrackerElement> clone_type() override {
        using this_t = std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t());
        return std::move(dup);
    }

    virtual std::unique_ptr<TrackerElement> clone_type(int in_id) override {
        using this_t = std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t(in_id));
        return std::move(dup);
    }

    void add_loc(double in_lat, double in_lon, double in_alt, unsigned int fix);

    __Proxy(valid, uint8_t, bool, bool, loc_valid);
    __Proxy(fix, uint8_t, unsigned int, unsigned int, loc_fix);

    std::shared_ptr<kis_tracked_location_triplet> get_min_loc() { return min_loc; }
    std::shared_ptr<kis_tracked_location_triplet> get_max_loc() { return max_loc; }
    std::shared_ptr<kis_tracked_location_triplet> get_avg_loc() { return avg_loc; }

    __Proxy(agg_lat, uint64_t, uint64_t, uint64_t, avg_lat);
    __Proxy(agg_lon, uint64_t, uint64_t, uint64_t, avg_lon);
    __Proxy(agg_alt, uint64_t, uint64_t, uint64_t, avg_alt);
    __Proxy(num_agg, int64_t, int64_t, int64_t, num_avg);
    __Proxy(num_alt_agg, int64_t, int64_t, int64_t, num_alt_avg);

protected:
    virtual void register_fields() override;

    // We save the IDs here because we dynamically generate them
    std::shared_ptr<kis_tracked_location_triplet> min_loc, max_loc, avg_loc;
    int min_loc_id, max_loc_id, avg_loc_id;

    std::shared_ptr<TrackerElementUInt8> loc_valid;
    std::shared_ptr<TrackerElementUInt8> loc_fix;

    std::shared_ptr<TrackerElementInt64> avg_lat;
    std::shared_ptr<TrackerElementInt64> avg_lon;
    std::shared_ptr<TrackerElementInt64> avg_alt;
    std::shared_ptr<TrackerElementInt64> num_avg;
    std::shared_ptr<TrackerElementInt64> num_alt_avg;
};

// Historic location track; used in the averaging / rrd historic location.
// Signal is tracked agnostically as whatever type of signal the owning device
// presents (dbm or rssi)
class kis_historic_location : public tracker_component {
public:
    kis_historic_location();
    kis_historic_location(int in_id);
    kis_historic_location(int in_id, std::shared_ptr<TrackerElementMap> e);

    virtual std::unique_ptr<TrackerElement> clone_type() override {
        using this_t = std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t());
        return std::move(dup);
    }

    virtual std::unique_ptr<TrackerElement> clone_type(int in_id) override {
        using this_t = std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t(in_id));
        return std::move(dup);
    }

    __Proxy(lat, double, double, double, lat);
    __Proxy(lon, double, double, double, lon);
    __Proxy(heading, double, double, double, heading);
    __Proxy(alt, double, double, double, alt);
    __Proxy(speed, double, double, double, speed);
    __Proxy(signal, int32_t, int32_t, int32_t, signal);
    __Proxy(time_sec, uint64_t, time_t, time_t, time_sec);
    __Proxy(frequency, uint64_t, uint64_t, uint64_t, frequency);

protected:
    virtual void register_fields() override;

    std::shared_ptr<TrackerElementDouble> lat;
    std::shared_ptr<TrackerElementDouble> lon;
    std::shared_ptr<TrackerElementDouble> alt;
    std::shared_ptr<TrackerElementDouble> heading; 
    std::shared_ptr<TrackerElementDouble> speed;

    std::shared_ptr<TrackerElementInt32> signal;
    std::shared_ptr<TrackerElementUInt64> frequency;

    std::shared_ptr<TrackerElementUInt64> time_sec;
};

// rrd-ish historic location cloud of cascading precision
// Collects a historical record about a device and then averages them to the next level
// of precision
class kis_location_history : public tracker_component { 
public:
    kis_location_history();
    kis_location_history(int in_id);
    kis_location_history(int in_id, std::shared_ptr<TrackerElementMap> e);

    virtual std::unique_ptr<TrackerElement> clone_type() override {
        using this_t = std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t());
        return std::move(dup);
    }

    virtual std::unique_ptr<TrackerElement> clone_type(int in_id) override {
        using this_t = std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t(in_id));
        return std::move(dup);
    }

    void add_sample(std::shared_ptr<kis_historic_location> in_sample);

    __ProxyPrivSplit(last_sample_ts, uint64_t, time_t, time_t, last_sample_ts);

protected:
    virtual void register_fields() override;
    virtual void reserve_fields(std::shared_ptr<TrackerElementMap> e) override;

    std::shared_ptr<TrackerElementVector> samples_100;
    std::shared_ptr<TrackerElementVector> samples_10k;
    std::shared_ptr<TrackerElementVector> samples_1m;

    std::shared_ptr<TrackerElementUInt64> last_sample_ts;

    unsigned int samples_100_cascade;
    unsigned int samples_10k_cascade;
};

#endif

