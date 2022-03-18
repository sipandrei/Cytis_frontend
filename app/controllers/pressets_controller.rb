class PressetsController < ApplicationController
  before_action :authenticate_user!

  def index
    @pressets = current_user.pressets.all
  end

  def new
    @presset = Presset.new
  end

  def edit
    @presset = Presset.find(params[:id])
  end

  def create
    @presset = current_user.pressets.build(presset_params)

    if @presset.save
      redirect_to pressets_path, notice: "Pressure Preset saved successfully"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    respond_to do |format|
      if Presset.find(params[:id]).update(presset_params)
        format.html { redirect_to pressets_path, notice: "Preset was successfully updated." }
      else
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    Presset.find(params[:id]).destroy

    respond_to do |format|
      format.html { redirect_to pressets_url, notice: "Article was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
  def presset_params
    params.require(:presset).permit(:user_id, :front_pressure, :rear_pressure, :name)
  end

end
