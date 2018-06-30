Rails.application.routes.draw do
  get 'home/index'


  devise_for :users, :controllers => { :registrations => "registrations" }
  devise_scope :user do
    get '/users/sign_out' => 'devise/sessions#destroy'
  end
  root to: 'home#index' # devise will break if you remove this line. By defining your root URL, Devise will use it for its redirection. For example, Devise will redirect the user to the root URL after they sign out from the application.

  post 'legislation_voices/up/:legislation_id' => "legislation_voices#up", as: :legislation_voices_up
  post 'legislation_voices/down/:legislation_id' => "legislation_voices#down", as: :legislation_voices_down

  get 'users/update_profile/' => 'users#update_profile'


  resources :legislator_votes

  resources :legislation_sponsors

  resources :legislation_voices

  resources :user_addresses

  resources :users

  resources :legislators

  resources :legislations

  resources :wards

  resources :community_meetings, except: [:index]
  # Mobile controller for iOS interaction

  resources :mobile, only: [:index]

  # Twitter API routes

  # Twilio

  post 'twilio/call' => 'twilio#call'
  get 'twilio/talk' => 'twilio#talk'



  #TODO: update these!
  # root to: 'high_voltage/pages#show', id: 'homepage'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

end
