class EventsController < ApplicationController
	#before_action :authenticate_user!, except: :show
	def index
		if params[:search].present?
			@events = Event.near(params[:search], 25)
		else
			@events = Event.all
		end
	end

	def show
		@event = Event.find(params[:id])
		@attendees = @event.attendees
		@body_id = 'show_body'
	end

	def new
		@event = current_user.events.build
		1.times { @event.ticket_types.build }
	end

	def create
		@event = current_user.events.build(event_params)
		if @event.save
			flash[:success] = 'Event created'
			redirect_to user_url(current_user)
		else
			render 'new'
		end
	end

	def edit
		@event = current_user.events.find(params[:id])
	end

	def update
		@event = current_user.events.find(params[:id])
		if @event.update(event_params)
			flash[:success] = 'Event updated'
			redirect_to event_url
		else
			render 'edit'
		end
	end

	def destroy
		@event = Event.find(params[:id])
		@event.destroy
		redirect_to current_user
	end

	private

	def event_params
		params.require(:event).permit(:title, :location_name, :street, :city_id,
		                              :state_id, :zip, :start, :end, :details,
		                              :category_id, :youtube_id, :flyer,
		                              :longitude, :latitude,
		                              :ticket_types_attributes => [:id, :name, :description, :cost, :quantity, :_destroy])
	end
end
