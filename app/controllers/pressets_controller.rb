class PressetsController < ApplicationController
  before_action :authenticate_user!

  def index
    @pressets = Presset.all
  end

  def new
    @presset = Presset.new
  end

  def edit
  end

  def create
    @presset = Presset.new(preset_params)

    respond_to do
      if @presset.save
        redirect_to presset_url(@presset), notice: "Pressure Presset saved successfully"
      else
        render :new, status: :unprocessable_entity
      end

    end
  end

  def update
    respond_to do |format|
      if @article.update(article_params)
        format.html { redirect_to article_url(@article), notice: "Article was successfully updated." }
        format.json { render :show, status: :ok, location: @article }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @article.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @article.destroy

    respond_to do |format|
      format.html { redirect_to articles_url, notice: "Article was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
  def presset_params
    params.require(:presset).permit(:user_id, :front_pressure, :rear_pressure)
  end

end
