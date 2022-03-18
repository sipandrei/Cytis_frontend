class AddNameToPresset < ActiveRecord::Migration[6.1]
  def change
    add_column :pressets, :name, :text, default: "Presset"
    #Ex:- add_column("admin_users", "username", :string, :limit =>25, :after => "email")
  end
end
