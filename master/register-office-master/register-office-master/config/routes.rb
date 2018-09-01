Rails.application.routes.draw do
  root to: 'register_office#index'
  resources :register_office, only: [:index, :show]
  resources :map, only: [:index]
end
