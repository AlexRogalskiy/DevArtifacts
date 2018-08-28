class CategoriesController < ApplicationController
	before_action :authenticate_user!
	before_action :admin
	def new
		@category = Category.new
	end

	def create
		@category = Category.new(category_params)
		if @category.save
			redirect_to admin_url
		else
			render new
		end
	end

	def edit
		@category = Category.find(params[:id])
	end

	def update
		@category = Category.find(params[:id])
		@category.update_attributes(category_params)
		redirect_to admin_url
	end

	def destroy
		@category = Category.find(params[:id]).destroy
	end

	private

	def category_params
		params.require(:category).permit(:name)
	end
end
