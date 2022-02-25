class CreatePressets < ActiveRecord::Migration[6.1]
  def change
    create_table :pressets do |t|
      t.integer :front_pressure
      t.integer :rear_pressure

      t.timestamps
    end
  end
end
