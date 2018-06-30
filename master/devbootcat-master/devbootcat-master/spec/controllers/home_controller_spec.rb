require 'spec_helper'

describe HomeController do

  login_user
  it "renders the index template" do
    get 'index'
    expect(response).to render_template(:index)
  end


end
