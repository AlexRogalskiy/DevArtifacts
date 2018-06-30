class LegislatorsController < ApplicationController
  before_action :set_legislator, only: [:show, :edit, :update, :destroy]
  # before_action :authenticate_user!

  include LegislatorsHelper
  # GET /legislators
  def index
    @legislators = Legislator.all
  end

  # GET /legislators/1
  def show
   @recently_sponsored = @legislator.sponsored_legislations.order('opened_date DESC').limit(5)
   @legislations_supported = @legislator.supported_legislations #array
   @legislations_opposed = @legislator.opposed_legislations
 end

  # GET /legislators/new
  def new
    @legislator = Legislator.new
  end

  # GET /legislators/1/edit
  def edit
  end

  # POST /legislators
  def create
    @legislator = Legislator.new(legislator_params)

    respond_to do |format|
      if @legislator.save
        format.html { redirect_to @legislator, notice: 'Legislator was successfully created.' }
      else
        format.html { render :new }
      end
    end
  end

  # PATCH/PUT /legislators/1
  def update
    respond_to do |format|
      if @legislator.update(legislator_params)
        format.html { redirect_to @legislator, notice: 'Legislator was successfully updated.' }
      else
        format.html { render :edit }
      end
    end
  end

  # DELETE /legislators/1
  def destroy
    @legislator.destroy
    respond_to do |format|
      format.html { redirect_to legislators_url, notice: 'Legislator was successfully destroyed.' }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_legislator
      @legislator = Legislator.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def legislator_params
      params.require(:legislator).permit(:alderman_id, :represented_ward_id, :term_start_date, :term_end_date, :party_affiliation)
    end
  end
