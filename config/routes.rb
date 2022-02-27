Rails.application.routes.draw do
  devise_for :users, conrollers: {registrations: 'registrations'}
  resources :pressets, except: [:show]
  root 'pages#inflator'
  get 'welcome' => 'pages#welcome'
  get 'inflator' => 'pages#inflator'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
