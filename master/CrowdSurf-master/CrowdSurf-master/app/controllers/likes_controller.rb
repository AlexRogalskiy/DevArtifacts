class LikesController < ApplicationController
	before_filter :authenticate_user!

	def create
		@event = Event.find(params[:like][:liked_id])
		current_user.like!(@event)
		respond_to do |format|
			format.html { redirect_to @event }
			format.js
		end
	end

	def destroy
		@event = Like.find(params[:id]).liked
		current_user.unlike!(@event)
		respond_to do |format|
			format.html { redirect_to @event }
			format.js
		end
	end
end
