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

ActiveRecord::Schema.define(version: 20140619215802) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "community_meetings", force: true do |t|
    t.integer  "creator_id"
    t.string   "address"
    t.string   "topic"
    t.integer  "ward_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.date     "date_at"
    t.time     "start_at"
    t.time     "end_at"
    t.float    "latitude"
    t.float    "longitude"
    t.text     "description"
    t.string   "city",        default: "Chicago"
    t.string   "state",       default: "IL"
    t.string   "zip"
  end

  add_index "community_meetings", ["creator_id"], name: "index_community_meetings_on_creator_id", using: :btree
  add_index "community_meetings", ["ward_id"], name: "index_community_meetings_on_ward_id", using: :btree

  create_table "legislation_sponsors", force: true do |t|
    t.integer  "sponsor_id"
    t.integer  "legislation_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "legislation_sponsors", ["legislation_id"], name: "index_legislation_sponsors_on_legislation_id", using: :btree
  add_index "legislation_sponsors", ["sponsor_id"], name: "index_legislation_sponsors_on_sponsor_id", using: :btree

  create_table "legislation_voices", force: true do |t|
    t.integer  "user_id"
    t.integer  "legislation_id"
    t.boolean  "support"
    t.text     "feedback"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "legislation_voices", ["legislation_id"], name: "index_legislation_voices_on_legislation_id", using: :btree
  add_index "legislation_voices", ["user_id"], name: "index_legislation_voices_on_user_id", using: :btree

  create_table "legislations", force: true do |t|
    t.string   "city_identifier"
    t.string   "status"
    t.string   "kind"
    t.date     "opened_date"
    t.date     "closed_date"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "title"
  end

  add_index "legislations", ["city_identifier"], name: "index_legislations_on_city_identifier", using: :btree

  create_table "legislator_votes", force: true do |t|
    t.integer  "legislation_id"
    t.integer  "legislator_id"
    t.date     "vote_date"
    t.string   "vote"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "legislator_votes", ["legislation_id"], name: "index_legislator_votes_on_legislation_id", using: :btree
  add_index "legislator_votes", ["legislator_id"], name: "index_legislator_votes_on_legislator_id", using: :btree

  create_table "legislators", force: true do |t|
    t.integer  "alderman_id"
    t.integer  "represented_ward_id"
    t.date     "term_start_date"
    t.date     "term_end_date"
    t.string   "party_affiliation"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "legislators", ["alderman_id"], name: "index_legislators_on_alderman_id", using: :btree
  add_index "legislators", ["represented_ward_id"], name: "index_legislators_on_represented_ward_id", using: :btree

  create_table "meeting_attendances", force: true do |t|
    t.integer  "user_id"
    t.integer  "community_meeting_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "meeting_attendances", ["community_meeting_id"], name: "index_meeting_attendances_on_community_meeting_id", using: :btree
  add_index "meeting_attendances", ["user_id"], name: "index_meeting_attendances_on_user_id", using: :btree

  create_table "user_addresses", force: true do |t|
    t.integer  "ward_id"
    t.string   "address1"
    t.string   "address2"
    t.string   "zip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_addresses", ["ward_id"], name: "index_user_addresses_on_ward_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.integer  "user_address_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email",                  default: "",                                                    null: false
    t.string   "encrypted_password",     default: "",                                                    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,                                                     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.text     "img_url",                default: "https://www.myzydeco.com/assets/blank_user_icon.png"
    t.string   "twitter_handle"
    t.string   "oauth_token_twitter"
    t.string   "oauth_secret_twitter"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["user_address_id"], name: "index_users_on_user_address_id", using: :btree

  create_table "wards", force: true do |t|
    t.integer  "ward_number"
    t.string   "address1"
    t.string   "address2"
    t.string   "zip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "phone_number"
  end

end
