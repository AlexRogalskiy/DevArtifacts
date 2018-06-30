class LegislatorVotesController < ApplicationController
  before_action :set_legislator_vote, only: [:show, :edit, :update, :destroy]

  # GET /legislator_votes
  def index
    @legislator_votes = LegislatorVote.all
  end

  # GET /legislator_votes/1
  def show
  end

  # GET /legislator_votes/new
  def new
    @legislator_vote = LegislatorVote.new
  end

  # GET /legislator_votes/1/edit
  def edit
  end

  # POST /legislator_votes
  def create
    @legislator_vote = LegislatorVote.new(legislator_vote_params)

    respond_to do |format|
      if @legislator_vote.save
        format.html { redirect_to @legislator_vote, notice: 'Legislator vote was successfully created.' }
        format.json { render :show, status: :created, location: @legislator_vote }
      else
        format.html { render :new }
        format.json { render json: @legislator_vote.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /legislator_votes/1
  def update
    respond_to do |format|
      if @legislator_vote.update(legislator_vote_params)
        format.html { redirect_to @legislator_vote, notice: 'Legislator vote was successfully updated.' }
        format.json { render :show, status: :ok, location: @legislator_vote }
      else
        format.html { render :edit }
        format.json { render json: @legislator_vote.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /legislator_votes/1
  def destroy
    @legislator_vote.destroy
    respond_to do |format|
      format.html { redirect_to legislator_votes_url, notice: 'Legislator vote was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_legislator_vote
      @legislator_vote = LegislatorVote.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def legislator_vote_params
      params.require(:legislator_vote).permit(:legislation_id, :legislator_id, :vote_date, :vote)
    end
end
