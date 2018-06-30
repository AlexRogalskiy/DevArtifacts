class WardsController < ApplicationController
  before_action :set_ward, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!

  # GET /wards
  def index
    @wards = Ward.all
  end

  # GET /wards/1
  def show
    @community_meetings = @ward.community_meetings.order('date_at DESC').limit(10)
    @legislator_votes = @ward.legislator.legislator_votes
  end

  # GET /wards/new
  def new
    @ward = Ward.new
  end

  # GET /wards/1/edit
  def edit
  end

  # POST /wards
  def create
    @ward = Ward.new(ward_params)

    respond_to do |format|
      if @ward.save
        format.html { redirect_to @ward, notice: 'Ward was successfully created.' }
      else
        format.html { render :new }
      end
    end
  end

  # PATCH/PUT /wards/1
  def update
    respond_to do |format|
      if @ward.update(ward_params)
        format.html { redirect_to @ward, notice: 'Ward was successfully updated.' }
      else
        format.html { render :edit }
      end
    end
  end

  # DELETE /wards/1
  def destroy
    @ward.destroy
    respond_to do |format|
      format.html { redirect_to wards_url, notice: 'Ward was successfully destroyed.' }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ward
      @ward = Ward.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def ward_params
      params.require(:ward).permit(:ward_number, :address1, :address2, :zip)
    end
end
