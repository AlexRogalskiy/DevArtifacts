require "spec_helper"

describe LegislatorsController do
  describe "routing" do

    it "routes to #index" do
      get("/legislators").should route_to("legislators#index")
    end

    it "routes to #new" do
      get("/legislators/new").should route_to("legislators#new")
    end

    it "routes to #show" do
      get("/legislators/1").should route_to("legislators#show", :id => "1")
    end

    it "routes to #edit" do
      get("/legislators/1/edit").should route_to("legislators#edit", :id => "1")
    end

    it "routes to #create" do
      post("/legislators").should route_to("legislators#create")
    end

    it "routes to #update" do
      put("/legislators/1").should route_to("legislators#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/legislators/1").should route_to("legislators#destroy", :id => "1")
    end

  end
end
