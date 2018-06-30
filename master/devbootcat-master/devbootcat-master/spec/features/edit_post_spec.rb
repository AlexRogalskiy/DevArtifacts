require 'spec_helper'

feature "User editing a Post" do
  before do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)
    @post = create(:post, title: "Lorem", body: "Ipsum", author_id: user.id)
  end

  it "can access the post editing form from the post's show page" do
    visit post_path(@post)

    expect(page).to have_content(@post.title)
    expect(page).to have_content(@post.body)
    expect(page).to have_link('Edit Post')
  end

  it "sees the post editing form and its content" do
    visit edit_post_path(@post)
    expect(page).to have_content("Edit Post")
    expect(page).to have_content("Title:")
    expect(page).to have_content("Content:")
    expect(page).to have_content("Ipsum")
    expect(page).to have_button("Update Post")
  end

  it "can update a post" do
    visit edit_post_path(@post)
    fill_in 'Title', with: "New title"
    fill_in 'Content', with: "Kate Upton's body"
    click_button('Update Post')

    expect(page).to have_content("New title")
    expect(page).to have_content("Kate Upton's body")
    expect(page).to have_content("Comments")
  end
end