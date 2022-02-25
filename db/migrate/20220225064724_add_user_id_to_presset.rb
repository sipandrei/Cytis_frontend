class AddUserIdToPresset < ActiveRecord::Migration[6.1]
  def change
    add_reference :pressets, :user, null: false, foreign_key: true
  end
end
