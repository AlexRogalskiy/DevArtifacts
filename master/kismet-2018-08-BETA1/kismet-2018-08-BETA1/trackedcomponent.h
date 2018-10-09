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

#ifndef __TRACKEDCOMPONENT_H__
#define __TRACKEDCOMPONENT_H__

#include "config.h"

#include <stdio.h>
#include <stdint.h>

#include <string>
#include <stdexcept>

#include <vector>
#include <map>

#include <memory>

#include "globalregistry.h"
#include "trackedelement.h"
#include "entrytracker.h"


// Complex trackable unit based on trackertype dataunion.
//
// All tracker_components are built from maps.
//
// Tracker components are stored via integer references, but the names are
// mapped via the entrytracker system.
//
// Sub-classes must initialize sub-fields by calling register_fields() in their
// constructors.  The register_fields() function is responsible for defining the
// types and builders, and recording the field_ids for all sub-fields and nested 
// components.
//
// Fields are allocated via the reserve_fields function, which must be called before
// use of the component.  By passing an existing trackermap object, a parsed tree
// can be annealed into the c++ representation without copying/re-parsing the data.
//
// Subclasses MUST override the signature, typically with a checksum of the class
// name, so that the entry tracker can differentiate multiple TrackerMap classes
class tracker_component : public TrackerElementMap {

// Ugly trackercomponent macro for proxying trackerelement values
// Defines get_<name> function, for a TrackerElement of type <ptype>, returning type 
// <rtype>, referencing class variable <cvar>
// Defines set_<name> funciton, for a TrackerElement of type <ptype>, taking type 
// <itype>, which must be castable to the TrackerElement type (itype), referencing 
// class variable <cvar>
#define __Proxy(name, ptype, itype, rtype, cvar) \
    virtual SharedTrackerElement get_tracker_##name() const { \
        return (std::shared_ptr<TrackerElement>) cvar; \
    } \
    virtual rtype get_##name() const { \
        return (rtype) GetTrackerValue<ptype>(cvar); \
    } \
    virtual void set_##name(const itype& in) { \
        SetTrackerValue<ptype>(cvar, static_cast<ptype>(in)); \
    }

// Ugly trackercomponent macro for proxying trackerelement values
// Defines get_<name> function, for a TrackerElement of type <ptype>, returning type 
// <rtype>, referencing class variable <cvar>
// Defines set_<name> funciton, for a TrackerElement of type <ptype>, taking type 
// <itype>, which must be castable to the TrackerElement type (itype), referencing 
// class variable <cvar>, which executes function <lambda> after the set command has
// been executed.  <lambda> should be of the form [](itype) -> bool
// Defines set_only_<name> which sets the trackerelement variable without
// calling the callback function
#define __ProxyL(name, ptype, itype, rtype, cvar, lambda) \
    virtual SharedTrackerElement get_tracker_##name() { \
        return (std::shared_ptr<TrackerElement>) cvar; \
    } \
    virtual rtype get_##name() const { \
        return (rtype) GetTrackerValue<ptype>(cvar); \
    } \
    virtual bool set_##name(const itype& in) { \
        cvar->set((ptype) in); \
        return lambda(in); \
    } \
    virtual void set_only_##name(const itype& in) { \
        cvar->set((ptype) in); \
    }

// Only proxy a Get function
#define __ProxyGet(name, ptype, rtype, cvar) \
    virtual rtype get_##name() { \
        return (rtype) GetTrackerValue<ptype>(cvar); \
    } 

// Only proxy a Set function for overload
#define __ProxySet(name, ptype, stype, cvar) \
    virtual void set_##name(const stype& in) { \
        SetTrackerValue<ptype>(cvar, in); \
    } 

// Proxy a split public/private get/set function; This is even funkier than the 
// normal proxy macro and should only be used in a 'public' segment of the class.
#define __ProxyPrivSplit(name, ptype, itype, rtype, cvar) \
    public: \
    virtual rtype get_##name() { \
        return (rtype) GetTrackerValue<ptype>(cvar); \
    } \
    protected: \
    virtual void set_int_##name(const itype& in) { \
        cvar->set((ptype) in); \
    } \
    public:

// Proxy increment and decrement functions
#define __ProxyIncDec(name, ptype, rtype, cvar) \
    virtual void inc_##name() { \
        (*cvar) += 1; \
    } \
    virtual void inc_##name(rtype i) { \
        (*cvar) += (ptype) i; \
    } \
    virtual void dec_##name() { \
        (*cvar) -= 1; \
    } \
    virtual void dec_##name(rtype i) { \
        (*cvar) -= (ptype) i; \
    }

// Proxy add/subtract
#define __ProxyAddSub(name, ptype, itype, cvar) \
    virtual void add_##name(itype i) { \
        (*cvar) += (ptype) i; \
    } \
    virtual void sub_##name(itype i) { \
        (*cvar) -= (ptype) i; \
    }

// Proxy sub-trackable (name, trackable type, class variable)
#define __ProxyTrackable(name, ttype, cvar) \
    virtual std::shared_ptr<ttype> get_##name() { \
        return cvar; \
    } \
    virtual void set_##name(std::shared_ptr<ttype> in) { \
        if (cvar != NULL) \
            erase(cvar); \
        cvar = in; \
        if (in != NULL) \
            insert(cvar); \
    }  \
    virtual SharedTrackerElement get_tracker_##name() { \
        return std::static_pointer_cast<TrackerElement>(cvar); \
    } 

// Proxy ONLY the get_tracker_* functions
#define __ProxyOnlyTrackable(name, ttype, cvar) \
    virtual SharedTrackerElement get_tracker_##name() { \
        return std::static_pointer_cast<TrackerElement>(cvar); \
    } 

// Proxy sub-trackable (name, trackable type, class variable, set function)
// Returns a shared_ptr instance of a trackable object, or defines a basic
// setting function.  Set function calls lambda, which should be of the signature
// [] (shared_ptr<ttype>) -> bool
#define __ProxyTrackableL(name, ttype, cvar, lambda) \
    virtual std::shared_ptr<ttype> get_##name() { \
        return cvar; \
    } \
    virtual bool set_##name(const shared_ptr<ttype>& in) { \
        if (cvar != NULL) \
            del_map(std::static_pointer_cast<TrackerElement>(cvar)); \
        cvar = in; \
        if (cvar != NULL) \
            add_map(std::static_pointer_cast<TrackerElement>(cvar)); \
        return lambda(in); \
    }  \
    virtual void set_only_##name(const shared_ptr<ttype>& in) { \
        cvar = in; \
    }  \
    virtual SharedTrackerElement get_tracker_##name() { \
        return std::static_pointer_cast<TrackerElement>(cvar); \
    } 


// Proxy dynamic trackable (value in class may be null and is dynamically
// built)
#define __ProxyDynamicTrackable(name, ttype, cvar, id) \
    virtual std::shared_ptr<ttype> get_##name() { \
        if (cvar == NULL) { \
            cvar = Globalreg::globalreg->entrytracker->GetSharedInstanceAs<ttype>(id); \
            if (cvar != NULL) \
                insert(cvar); \
        } \
        return cvar; \
    } \
    virtual void set_tracker_##name(std::shared_ptr<ttype> in) { \
        if (cvar != nullptr) \
            erase(cvar); \
        cvar = in; \
        if (cvar != nullptr) { \
            cvar->set_id(id); \
            insert(std::static_pointer_cast<TrackerElement>(cvar)); \
        } \
    } \
    virtual SharedTrackerElement get_tracker_##name() { \
        return std::static_pointer_cast<TrackerElement>(cvar); \
    } \
    virtual bool has_##name() const { \
        return cvar != NULL; \
    }

// Proxy bitset functions (name, trackable type, data type, class var)
#define __ProxyBitset(name, dtype, cvar) \
    virtual void bitset_##name(dtype bs) { \
        (*cvar) |= bs; \
    } \
    virtual void bitclear_##name(dtype bs) { \
        (*cvar) &= ~(bs); \
    } \
    virtual dtype bitcheck_##name(dtype bs) { \
        return (dtype) (GetTrackerValue<dtype>(cvar) & bs); \
    }

public:
    tracker_component() :
        TrackerElementMap(0) { }

    tracker_component(int in_id) :
        TrackerElementMap(in_id) { }

    tracker_component(int in_id, std::shared_ptr<TrackerElementMap> e __attribute__((unused))) :
        TrackerElementMap(in_id) { }

	virtual ~tracker_component() { }

    virtual std::unique_ptr<TrackerElement> clone_type() override {
        using this_t = std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t());
        return std::move(dup);
    }

    virtual std::unique_ptr<TrackerElement> clone_type(int in_id) override {
        using this_t = std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t());
        return std::move(dup);
    }

    tracker_component(tracker_component&&) = default;
    tracker_component& operator=(tracker_component&&) = default;

    tracker_component(tracker_component&) = delete;
    tracker_component& operator=(tracker_component&) = delete;

    // Return the name via the entrytracker
    virtual std::string get_name();

    // Proxy getting any name via entry tracker
    virtual std::string get_name(int in_id);

    SharedTrackerElement get_child_path(const std::string& in_path);
    SharedTrackerElement get_child_path(const std::vector<std::string>& in_path);

protected:
    // Register a field via the entrytracker, using standard entrytracker build methods.
    // This field will be automatically assigned or created during the reservefields 
    // stage.
    //
    // If in_dest is a nullptr, it will not be instantiated; this is useful for registering
    // sub-components of maps which may not be directly instantiated as top-level fields
    int RegisterField(const std::string& in_name, std::unique_ptr<TrackerElement> in_builder,
            const std::string& in_desc, SharedTrackerElement *in_dest = nullptr);

    // Register a field, automatically deriving its type from the provided destination
    // field.  The destination field must be specified.
    template<typename T>
    int RegisterField(const std::string& in_name, const std::string& in_desc, 
            std::shared_ptr<T> *in_dest) {
        using build_type = typename std::remove_reference<decltype(**in_dest)>::type;

        return RegisterField(in_name, TrackerElementFactory<build_type>(), in_desc, 
                reinterpret_cast<SharedTrackerElement *>(in_dest));
    }

    // Register a field, automatically deriving its type from the provided destination
    // field.  The destination field must be specified.
    //
    // The field will not be initialized during normal initialization, it will only be
    // created when the field is accessed.  
    //
    // This field should be mapped via the __ProxyDynamicTrackable call
    template<typename T>
    int RegisterDynamicField(const std::string& in_name, const std::string& in_desc, 
            std::shared_ptr<T> *in_dest) {
        using build_type = typename std::remove_reference<decltype(**in_dest)>::type;

        int id = 
            Globalreg::globalreg->entrytracker->RegisterField(in_name, 
                    TrackerElementFactory<build_type>(), in_desc);

        auto rf = std::unique_ptr<registered_field>(new registered_field(id, 
                    reinterpret_cast<SharedTrackerElement *>(in_dest), 
                    true));
        registered_fields.push_back(std::move(rf));

        return id;
    }

    // Register field types and get a field ID.  Called during record creation, prior to 
    // assigning an existing trackerelement tree or creating a new one
    virtual void register_fields() { }

    // Populate fields - either new (e == NULL) or from an existing structure which
    //  may contain a generic version of our data.
    // When populating from an existing structure, bind each field to this instance so
    //  that we can track usage and delete() appropriately.
    // Populate automatically based on the fields we have reserved, subclasses can 
    // override if they really need to do something special
    virtual void reserve_fields(std::shared_ptr<TrackerElementMap> e);

    // Inherit from an existing element or assign a new one.
    // Add imported or new field to our map for use tracking.
    virtual SharedTrackerElement import_or_new(std::shared_ptr<TrackerElementMap> e, int i);

    class registered_field {
        public:
            registered_field(int id, SharedTrackerElement *assign) { 
                this->id = id; 
                this->assign = assign;

                if (assign == nullptr)
                    this->dynamic = true;
                else
                    this->dynamic = false;
            }

            registered_field(int id, SharedTrackerElement *assign, bool dynamic) {
                if (assign == nullptr && dynamic)
                    throw std::runtime_error("attempted to assign a dynamic field to "
                            "a null destination");

                this->id = id;
                this->assign = assign;
                this->dynamic = dynamic;
            }

            int id;
            bool dynamic;
            SharedTrackerElement *assign;
    };

    std::vector<std::unique_ptr<registered_field>> registered_fields;
};



#endif
