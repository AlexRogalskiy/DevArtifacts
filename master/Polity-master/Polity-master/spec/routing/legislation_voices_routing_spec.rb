require "spec_helper"

describe LegislationVoicesController do
  describe "routing" do

    it "routes to #index" do
      get("/legislation_voices").should route_to("legislation_voices#index")
    end

    it "routes to #new" do
      get("/legislation_voices/new").should route_to("legislation_voices#new")
    end

    it "routes to #show" do
      get("/legislation_voices/1").should route_to("legislation_voices#show", :id => "1")
    end

    it "routes to #edit" do
      get("/legislation_voices/1/edit").should route_to("legislation_voices#edit", :id => "1")
    end

    it "routes to #create" do
      post("/legislation_voices").should route_to("legislation_voices#create")
    end

    it "routes to #update" do
      put("/legislation_voices/1").should route_to("legislation_voices#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/legislation_voices/1").should route_to("legislation_voices#destroy", :id => "1")
    end

  end
end
