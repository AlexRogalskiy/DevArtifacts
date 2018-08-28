class Api::V1::EventsController < EventsController
  #before_filter :authenticate_user!, except: [:show]
  respond_to :json

  def index
    if params[:search].present?
      respond_with @events = Event.near(params[:search], 25)
    else
      respond_with @events = Event.all
    end
  end

  def show
    @event = Event.find(params[:id])
    respond_with @event
  end

  def new
    respond_with @event = current_user.events.build
  end

  def create
    @event = current_user.events.build(event_params)
    if @event.save
      flash[:success] = 'Event created'
      redirect_to user_url(current_user)
    else
      render 'new'
    end
    respond_with @event
  end

  def edit
    respond_with @event = current_user.events.find(params[:id])
  end

  def update
    @event = current_user.events.find(params[:id])
    if @event.update(event_params)
      flash[:success] = 'Event updated'
      redirect_to event_url
    else
      render 'edit'
    end
    respond_with @event
  end

  def destroy
    @event = Event.find(params[:id])
    @event.destroy
    respond_with @event
    redirect_to current_user
  end

end