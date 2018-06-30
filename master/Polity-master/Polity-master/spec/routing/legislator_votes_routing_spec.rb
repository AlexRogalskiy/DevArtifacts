require "spec_helper"

describe LegislatorVotesController do
  describe "routing" do

    it "routes to #index" do
      get("/legislator_votes").should route_to("legislator_votes#index")
    end

    it "routes to #new" do
      get("/legislator_votes/new").should route_to("legislator_votes#new")
    end

    it "routes to #show" do
      get("/legislator_votes/1").should route_to("legislator_votes#show", :id => "1")
    end

    it "routes to #edit" do
      get("/legislator_votes/1/edit").should route_to("legislator_votes#edit", :id => "1")
    end

    it "routes to #create" do
      post("/legislator_votes").should route_to("legislator_votes#create")
    end

    it "routes to #update" do
      put("/legislator_votes/1").should route_to("legislator_votes#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/legislator_votes/1").should route_to("legislator_votes#destroy", :id => "1")
    end

  end
end
