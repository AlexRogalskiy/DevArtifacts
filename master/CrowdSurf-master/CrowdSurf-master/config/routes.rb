require 'api_constraints'
Rails.application.routes.draw do

  namespace :api, defaults: {format: 'json'}, :path => '', constraints: {subdomain: 'api'} do
    scope module: :v1, constraints: ApiConstraints.new(version: 1, default: true) do
      resources :events
      resources :users, only: [:index, :show]
      resources :relationships, only: [:create, :destroy]
      resources :likes, only: [:create, :destroy]
      resources :attends, only: [:create, :destroy]
      devise_scope :user do
        match '/login' => 'sessions#create', :via => :post
        match '/logout' => 'sessions#destroy', :via => :delete
        match '/sign_up' => 'registrations#create', :via => :post
      end
    end
  end


  get 'main_pages/index'

  root to: 'prelaunch#index'

  match 'about', to: 'main_pages#about', via: 'get'

  match 'admin', to: 'admin_panel#index', via: 'get'

  devise_for :users, :path => '', :path_names => {:sign_in => 'login', :sign_out => 'logout'}

	resources :users, only: [:index, :show] do
		member do
			get :followings, :followers
		end
	end

  resources :events

  resources :tickets, :ticket_types, :categories, :cities, :states, :purchases

	resources :relationships, only: [:create, :destroy]

  resources :likes, only: [:create, :destroy]

  resources :attends, only: [:create, :destroy]
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
