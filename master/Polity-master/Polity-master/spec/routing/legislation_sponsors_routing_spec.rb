require "spec_helper"

describe LegislationSponsorsController do
  describe "routing" do

    it "routes to #index" do
      get("/legislation_sponsors").should route_to("legislation_sponsors#index")
    end

    it "routes to #new" do
      get("/legislation_sponsors/new").should route_to("legislation_sponsors#new")
    end

    it "routes to #show" do
      get("/legislation_sponsors/1").should route_to("legislation_sponsors#show", :id => "1")
    end

    it "routes to #edit" do
      get("/legislation_sponsors/1/edit").should route_to("legislation_sponsors#edit", :id => "1")
    end

    it "routes to #create" do
      post("/legislation_sponsors").should route_to("legislation_sponsors#create")
    end

    it "routes to #update" do
      put("/legislation_sponsors/1").should route_to("legislation_sponsors#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/legislation_sponsors/1").should route_to("legislation_sponsors#destroy", :id => "1")
    end

  end
end
