class StatesController < ApplicationController
	before_action :admin

	def new
		@state = State.new
	end

	def create
		@state = State.new(state_params)
		if @state.save
			redirect_to admin_url
		else
			render new
		end
	end

	def edit
		@state = State.find(params[:id])
	end

	def update
		@state = State.find(params[:id])
		@state.update_attributes(state_params)
		redirect_to admin_url
	end

	def destroy
		@state = State.find(params[:id]).destroy
	end

	private

	def state_params
		params.require(:state).permit(:name)
	end
end
