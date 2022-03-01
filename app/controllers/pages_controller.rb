class PagesController < ApplicationController
  before_action :from_welcome, only: [:welcome]

  def welcome
  end

  def inflator
  end

  private
  def from_welcome
    redirect_to :inflator if current_user

  end

end
