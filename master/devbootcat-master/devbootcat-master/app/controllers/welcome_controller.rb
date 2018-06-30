class WelcomeController < ApplicationController

    def index
        if user_signed_in?
            redirect_to '/'
        else
            redirect_to '/'
        end
    end
end

















