class AttendsController < ApplicationController
	before_filter :authenticate_user!


	def create
		@event = Event.find(params[:attend][:attended_id])
		current_user.attend!(@event)
		respond_to do |format|
			format.html { redirect_to @event }
			format.js
		end
	end

	def destroy
		@event = Attend.find(params[:id]).attended
		current_user.leave!(@event)
		respond_to do |format|
			format.html { redirect_to @event }
			format.js
		end
	end
end
