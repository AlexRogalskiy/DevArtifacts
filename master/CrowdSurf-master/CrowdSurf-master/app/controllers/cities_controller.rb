class CitiesController < ApplicationController
	before_action :admin
	def new
		@city = City.new
	end

	def create
		@city = City.new(city_params)
		if @city.save
			redirect_to admin_url
		else
			render new
		end
	end

	def edit
		@city = City.find(params[:id])
	end

	def update
		@city = City.find(params[:id])
		@city.update_attributes(city_params)
		redirect_to admin_url
	end

	def destroy
		@city = City.find(params[:id]).destroy
	end

	private

	def city_params
		params.require(:city).permit(:name, :state_id)
	end
end
