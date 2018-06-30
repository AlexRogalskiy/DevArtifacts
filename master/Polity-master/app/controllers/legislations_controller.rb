class LegislationsController < ApplicationController
  before_action :set_legislation, only: [:show, :edit, :update, :destroy]
  # before_action :authenticate_user!

  # GET /legislations

  def index
    @legislations = Legislation.all
  end
  # GET /legislations/1
  def show

  end

  # GET /legislations/new
  def new
    @legislation = Legislation.new
  end

  # GET /legislations/1/edit
  def edit
  end


  # POST /legislations
  def create
    @legislation = Legislation.new(legislation_params)

    respond_to do |format|
      if @legislation.save
        format.html { redirect_to @legislation, notice: 'Legislation was successfully created.' }
        format.json { render :show, status: :created, location: @legislation }
      else
        format.html { render :new }
      end
    end
  end

  # PATCH/PUT /legislations/1
  def update
    respond_to do |format|
      if @legislation.update(legislation_params)
        format.html { redirect_to @legislation, notice: 'Legislation was successfully updated.' }
      else
        format.html { render :edit }
      end
    end
  end

  # DELETE /legislations/1
  def destroy
    @legislation.destroy
    respond_to do |format|
      format.html { redirect_to legislations_url, notice: 'Legislation was successfully destroyed.' }
    end
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_legislation
      @legislation = Legislation.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def legislation_params
      params.require(:legislation).permit(:city_identifier, :status, :type, :opened_date, :closed_date)
    end

end
