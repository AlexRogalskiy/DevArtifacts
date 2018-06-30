class UserAddressesController < ApplicationController
  before_action :set_user_address, only: [:show, :edit, :update, :destroy]

  # GET /user_addresses
  def index
    @user_addresses = UserAddress.all
  end

  # GET /user_addresses/1
  def show
  end

  # GET /user_addresses/new
  def new
    @user_address = UserAddress.new
  end

  # GET /user_addresses/1/edit
  def edit
  end


  # POST /user_addresses
  def create
    puts params
    current_user_first_name = params["user_address"]["users"]["first_name"]
    current_user_last_name = params["user_address"]["users"]["last_name"]
    current_user_img_url = params["user_address"]["users"]["img_url"]
    current_user_twitter_handle = params["user_address"]["users"]["twitter_handle"]
    user_address_address1 = params["user_address"]["address1"]

    if UserAddress.find_by_address1(user_address_address1)
      @user_address = UserAddress.find_by_address1(user_address_address1)
      p @user_address
      puts "----------------------------------------"
      @user_address.update_attributes!(user_address_params)
      # puts @user_address.ward_id
      # puts @user_address.address1
    else
      puts "+++++++++++++++++++++++++++++++"
      @user_address = UserAddress.create!(user_address_params)
    end

    respond_to do |format|
      if @user_address.valid?
        current_user.update_attributes(user_address_id: @user_address.id, first_name: current_user_first_name, last_name: current_user_last_name, img_url: current_user_img_url, twitter_handle: current_user_twitter_handle)
        format.html { redirect_to current_user, notice: 'User address was successfully created.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user_address.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user_addresses/1
  def update
    respond_to do |format|
      if @user_address.update(user_address_params)
        format.html { redirect_to @user_address, notice: 'User address was successfully updated.' }
        format.json { render :show, status: :ok, location: @user_address }
      else
        format.html { render :edit }
        format.json { render json: @user_address.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_addresses/1
  def destroy
    @user_address.destroy
    respond_to do |format|
      format.html { redirect_to user_addresses_url, notice: 'User address was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_address
      @user_address = UserAddress.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_address_params
      params.require(:user_address).permit(:ward_id, :address1, :address2, :zip)
    end
end
