class CommunityMeetingsController < ApplicationController
  before_action :set_community_meeting, only: [:show, :edit, :update, :destroy]
  # before_filter :authenticate_user!

  # GET /community_meetings/1
  def show
  end

  # GET /community_meetings/new
  def new
    @community_meeting = CommunityMeeting.new
  end

  # GET /community_meetings/1/edit
  def edit
    @community_meeting = CommunityMeeting.find(params[:id])
  end

  # POST /community_meetings
  def create
    @community_meeting = current_user.created_meetings.new(community_meeting_params)
    @community_meeting.ward_id = current_user.ward.id

    respond_to do |format|
      if @community_meeting.save
        format.html { redirect_to @community_meeting.ward, notice: 'Community meeting was successfully created.' } #TODOS: Add flash notices for community meetings
      else
        format.html { render :new }
      end
    end
  end

  # PATCH/PUT /community_meetings/1
  def update
    respond_to do |format|
      if @community_meeting.update(community_meeting_params)
        format.html { redirect_to @community_meeting, notice: 'Community meeting was successfully updated.' }
      else
        format.html { render :edit }
      end
    end
  end

  # DELETE /community_meetings/1
  def destroy
    @community_meeting = set_community_meeting
    @community_meeting.destroy
    respond_to do |format|
      format.html { redirect_to ward_path(current_user.ward), notice: 'Community meeting was successfully destroyed.' }
    end
  end


  private
    def set_community_meeting
      @community_meeting = CommunityMeeting.find(params[:id])
    end

    def community_meeting_params
      params.require(:community_meeting).permit(:creator_id, :address, :date_at, :start_at, :end_at, :topic, :ward_id, :description, :city, :state, :zip)
    end
end
