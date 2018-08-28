# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141020004200) do

  create_table "attends", force: true do |t|
    t.integer  "attendee_id"
    t.integer  "attended_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "attends", ["attended_id"], name: "index_attends_on_attended_id"
  add_index "attends", ["attendee_id", "attended_id"], name: "index_attends_on_attendee_id_and_attended_id", unique: true
  add_index "attends", ["attendee_id"], name: "index_attends_on_attendee_id"

  create_table "categories", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cities", force: true do |t|
    t.string   "name"
    t.integer  "state_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events", force: true do |t|
    t.string   "title"
    t.string   "location_name"
    t.string   "street"
    t.string   "city_id"
    t.string   "state_id"
    t.string   "zip"
    t.float    "longitude"
    t.float    "latitude"
    t.string   "youtube_id"
    t.integer  "category_id"
    t.string   "flyer_uid"
    t.string   "flyer_name"
    t.text     "details"
    t.datetime "start"
    t.datetime "end"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "events", ["user_id", "created_at"], name: "index_events_on_user_id_and_created_at"

  create_table "likes", force: true do |t|
    t.integer  "liker_id"
    t.integer  "liked_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "likes", ["liked_id"], name: "index_likes_on_liked_id"
  add_index "likes", ["liker_id", "liked_id"], name: "index_likes_on_liker_id_and_liked_id", unique: true
  add_index "likes", ["liker_id"], name: "index_likes_on_liker_id"

  create_table "purchases", force: true do |t|
    t.integer  "purchaser_id"
    t.integer  "ticket_type_id"
    t.integer  "quantity"
    t.decimal  "cost",           precision: 9, scale: 2
    t.decimal  "ticket_fee",     precision: 9, scale: 2
    t.datetime "purchased_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "relationships", force: true do |t|
    t.integer  "follower_id"
    t.integer  "followed_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "relationships", ["followed_id"], name: "index_relationships_on_followed_id"
  add_index "relationships", ["follower_id", "followed_id"], name: "index_relationships_on_follower_id_and_followed_id", unique: true
  add_index "relationships", ["follower_id"], name: "index_relationships_on_follower_id"

  create_table "states", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "ticket_types", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "event_id"
    t.decimal  "cost",        precision: 9, scale: 2
    t.decimal  "ticket_fee",  precision: 9, scale: 2
    t.integer  "quantity"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "total_price", precision: 9, scale: 2
  end

  create_table "tickets", force: true do |t|
    t.integer  "ticket_type_id"
    t.integer  "purchase_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "username"
    t.boolean  "admin",                  default: false, null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  add_index "users", ["username"], name: "index_users_on_username", unique: true

end
