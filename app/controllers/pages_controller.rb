class PagesController < ApplicationController
  before_action :to_welcome, except: [:welcome]
  def welcome
  end

  def inflator
  end

  private
  def to_welcome
    redirect_to :welcome unless current_user
  end

end
