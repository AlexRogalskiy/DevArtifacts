class LegislationVoicesController < ApplicationController
  before_action :set_legislation_voice, only: [:show, :edit, :update, :destroy]

  def up
    @legislator = Legislator.find_by(alderman_id:current_user.alderman.id)
    @user_feedback = @legislator.voted_legislations.order('opened_date DESC').limit(5).sample
    @legislator_vote = @legislator.issue_vote(@user_feedback.id)
    unless current_user.legislation_voices.find_by_legislation_id(params[:legislation_id])
      @legislation_voice = current_user.legislation_voices.create(legislation_id: params[:legislation_id], support: true)
    end
    render json: {feedback: @user_feedback, vote: @legislator_vote}
  end

  def down
    @legislator = Legislator.find_by(alderman_id:current_user.alderman.id)
    @user_feedback = @legislator.voted_legislations.order('opened_date DESC').limit(5).sample
    @legislator_vote = @legislator.issue_vote(@user_feedback.id)
    unless current_user.legislation_voices.find_by_legislation_id(params[:legislation_id])
      @legislation_voice = current_user.legislation_voices.create(legislation_id: params[:legislation_id], support: false)
    end
    render json: {feedback: @user_feedback, vote: @legislator_vote}
  end


  def new
    @legislation = Legislation.find_by_id(params[:legislation])
    @legislation_voice = LegislationVoice.new()
  end

  def create
    unless current_user.legislation_voices.find_by_legislation_id(legislation_voice_params[:legislation_id])
      @legislation_voice = LegislationVoice.new(legislation_voice_params)

      respond_to do |format|
        if @legislation_voice.save
          format.html { render notice: 'User feedback was successfully created.' }
          format.json { render :show, status: :created, location: @legislation_voice }
        else
          format.html { render :new }
          format.json { render json: @legislation_voice.errors, status: :unprocessable_entity }
        end
      end
    end
    redirect_to current_user
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_legislation_voice
      @legislation_voice = LegislationVoice.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def legislation_voice_params
      params.require(:legislation_voice).permit(:user_id, :legislation_id, :support, :feedback)
    end
  end