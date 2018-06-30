require 'spec_helper'

feature 'Signing in' do

  background do
    create :user, email: 'person@example.com', password: 'my_new_password!'
  end

  scenario 'signs the user in successfully with a valid email and password' do
    visit root_path
    sign_in_with('person@example.com', 'my_new_password!')
    user_sees_notice 'Signed in successfully'
  end

  scenario 'user tries to sign in with invalid credientials' do
    visit root_path
    sign_in_with('person@email.com', 'somevalidbutincorrect!')
    user_sees_alert 'Invalid email or password'
  end



private
  def sign_in_with(email, password)
    visit root_path
    fill_in 'Email', with: email
    fill_in 'Password', with: password
    click_on 'Sign in'
  end

  def user_sees_notice(text)
    expect(page).to have_css '.notice', text: text
  end

  def user_sees_alert(text)
    expect(page).to have_css '.alert', text: text
  end

end