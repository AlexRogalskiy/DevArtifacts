require 'spec_helper'

feature "User Dashboard/Home Page" do
  before do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)
  end

  it "can see all post titles" do
    create(:post, title: "Muder in Chinatown", body: "Kate Beckinsale")
    create(:post, title: "Raining women in Thailand", body: "Kate Upton")

    visit '/'
    expect(page).to have_content("Muder in Chinatown")
    expect(page).to have_content("Raining women in Thailand")
  end

  it "can see excerpt of all posts body" do
    create(:post, title: "Cats are Cool", body: "Chase mice. Rub face on everything why must they do that behind the couch. Claw drapes chew foot and give attitude, hopped up on goofballs so intrigued by the shower climb leg under the bed. Flop over intently stare at the same spot but lick butt. Cat snacks attack feet and give attitude. Flop over flop over yet throwup on your pillow rub face on everything lick butt for behind the couch. Shake treat bag inspect anything brought into the house chase mice. Hide when guests come over climb leg stretch for nap all day sleep on keyboard shake treat bag, yet leave dead animals as gifts. Why must they do that intently sniff hand rub face on everything and hate dog and all of a sudden go crazy but use lap as chair. Shake treat bag chew foot or chew foot. Nap all day intently stare at the same spot")
    create(:post, title: "Cats Sleep in the Sun", body: "Chew iPad power cord under the bed stick butt in face, all of a sudden go crazy, sweet beast, yet sleep on keyboard, play time. Swat at dog use lap as chair rub face on everything but chew foot and burrow under covers attack feet. Cat snacks. Hunt anything that moves leave dead animals as gifts or burrow under covers but under the bed. Chase imaginary bugs hopped up on goofballs but hunt anything that moves. Cat snacks hide when guests come over. Give attitude chew foot but stick butt in face sweet beast under the bed and climb leg. Climb leg hunt anything that moves, and need to chase tail so run in circles so give attitude. Give attitude chew foot behind the couch. Use lap as chair attack feet yet chase mice flop over cat snacks intently sniff hand, for chew foot. Behind the couch. Stretch why must they do that so leave dead animals as gifts yet under the bed, use lap as chair. Intently stare at the same spot intently stare at the same spot shake treat bag for hopped up on goofballs or run in circles rub face on everything or throwup on your pillow.")

    visit '/'
    expect(page).to have_content("Chase mice. Rub face on everything why")
    expect(page).to have_content("Chew iPad power cord under the bed stick butt in face, all of a sudden go crazy")
  end

  it "can not see full content of all posts body" do
    create(:post, title: "Cats are Cool", body: "Chase mice. Rub face on everything why must they do that behind the couch. Claw drapes chew foot and give attitude, hopped up on goofballs so intrigued by the shower climb leg under the bed. Flop over intently stare at the same spot but lick butt. Cat snacks attack feet and give attitude. Flop over flop over yet throwup on your pillow rub face on everything lick butt for behind the couch. Shake treat bag inspect anything brought into the house chase mice. Hide when guests come over climb leg stretch for nap all day sleep on keyboard shake treat bag, yet leave dead animals as gifts. Why must they do that intently sniff hand rub face on everything and hate dog and all of a sudden go crazy but use lap as chair. Shake treat bag chew foot or chew foot. Nap all day intently stare at the same spot")
    create(:post, title: "Cats Sleep in the Sun", body: "Chew iPad power cord under the bed stick butt in face, all of a sudden go crazy, sweet beast, yet sleep on keyboard, play time. Swat at dog use lap as chair rub face on everything but chew foot and burrow under covers attack feet. Cat snacks. Hunt anything that moves leave dead animals as gifts or burrow under covers but under the bed. Chase imaginary bugs hopped up on goofballs but hunt anything that moves. Cat snacks hide when guests come over. Give attitude chew foot but stick butt in face sweet beast under the bed and climb leg. Climb leg hunt anything that moves, and need to chase tail so run in circles so give attitude. Give attitude chew foot behind the couch. Use lap as chair attack feet yet chase mice flop over cat snacks intently sniff hand, for chew foot. Behind the couch. Stretch why must they do that so leave dead animals as gifts yet under the bed, use lap as chair. Intently stare at the same spot intently stare at the same spot shake treat bag for hopped up on goofballs or run in circles rub face on everything or throwup on your pillow.")

    visit '/'
    expect(page).not_to have_content("Nap all day intently stare at the same spot")
    expect(page).not_to have_content("run in circles rub face on everything or throwup on your pillow.")
  end
end
