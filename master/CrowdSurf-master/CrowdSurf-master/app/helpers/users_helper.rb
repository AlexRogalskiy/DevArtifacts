module UsersHelper

	def admin
		unless current_user.admin
			redirect_to root_path
		end
	end
end
