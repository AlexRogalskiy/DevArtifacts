require "spec_helper"

describe LegislationsController do
  describe "routing" do

    it "routes to #index" do
      get("/legislations").should route_to("legislations#index")
    end

    it "routes to #new" do
      get("/legislations/new").should route_to("legislations#new")
    end

    it "routes to #show" do
      get("/legislations/1").should route_to("legislations#show", :id => "1")
    end

    it "routes to #edit" do
      get("/legislations/1/edit").should route_to("legislations#edit", :id => "1")
    end

    it "routes to #create" do
      post("/legislations").should route_to("legislations#create")
    end

    it "routes to #update" do
      put("/legislations/1").should route_to("legislations#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/legislations/1").should route_to("legislations#destroy", :id => "1")
    end

  end
end
