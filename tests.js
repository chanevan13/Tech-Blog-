const assert = require("assert");

const Sequelize = require("sequelize");
const sequelize = new Sequelize({ dialect: "sqlite", storage: "csqueeze.db" });
const models = require("./models");

const mockData = {
  blogposts: [
    {
        comments: [{ id: 1, content: "This was really inspiring", UserId: 1 }],
      title: "Memes found to decrease vibrational energy",
      description:
        'In the captivating blog post "Memes Found to Decrease Vibrational Energy," we explore the surprising impact of internet memes on our emotional and energetic states. Delving into the realm of humor and online culture, scientific research reveals that engaging with memes can actually lower our vibrational energy levels, resulting in reduced stress and enhanced well-being. This intriguing phenomenon highlights the transformative power of laughter and the potential of lighthearted content to uplift our spirits amidst the digital age. Discover how a simple scroll through memes can offer a delightful reprieve from everyday pressures and unlock the secrets to harnessing positive vibrations in our lives.',
      content: `Introduction:

In the captivating blog post "Memes Found to Decrease Vibrational Energy," we delve into the surprising impact of internet memes on our emotional and energetic states. In a world where stress and anxiety seem to be ever-present, it's intriguing to discover that something as lighthearted as a meme can actually lower our vibrational energy levels. Through scientific research, we explore the transformative power of laughter and how engaging with memes can enhance our well-being and offer a delightful reprieve from everyday pressures. Join us as we unlock the secrets to harnessing positive vibrations in our lives.

The Digital Age and its Influence on Our Well-Being:

In the era of the digital age, we find ourselves constantly bombarded with information, social media feeds, and the pressures of staying connected. Our lives have become intertwined with technology, and while it offers many benefits, it also brings its fair share of challenges. The constant exposure to negative news, comparison culture, and the relentless pursuit of perfection can take a toll on our mental and emotional well-being.

Enter Memes: A Source of Laughter and Relief:

In the midst of this digital landscape, memes have emerged as a popular form of content that brings a smile to our faces. These humorous and often relatable images or videos have become a language of their own, transcending boundaries and connecting people worldwide. But beyond their entertainment value, recent scientific studies have shown that memes have a profound impact on our vibrational energy.

Understanding Vibrational Energy:

Vibrational energy, also known as emotional or energetic frequency, refers to the energy we emit based on our emotional state. Everything in the universe, including our thoughts and emotions, carries a specific frequency. Higher vibrational energy is associated with positive emotions such as love, joy, and gratitude, while lower vibrational energy corresponds to negative emotions like fear, stress, and anger.

The Transformative Power of Laughter:

Laughter has long been recognized as a powerful tool for improving well-being. It releases endorphins, the body's natural "feel-good" chemicals, and reduces stress hormones, promoting a sense of relaxation and happiness. Memes, with their ability to generate laughter, tap into this transformative power.

Scientific Research Reveals the Impact of Memes on Vibrational Energy:

Research conducted in recent years has shed light on the relationship between memes and vibrational energy. Studies have shown that when we engage with memes, our vibrational energy levels tend to decrease, indicating a shift from negative emotions to a more positive state of mind. This decrease in vibrational energy can lead to reduced stress, improved mood, and enhanced overall well-being.

The Reprieve and Upliftment Memes Offer:

In the fast-paced world we live in, where pressures and responsibilities can often become overwhelming, memes provide a much-needed reprieve. A simple scroll through our social media feeds can instantly transport us into a world of humor, relatability, and shared experiences. They offer us an opportunity to momentarily detach from our worries, fostering a sense of lightheartedness and perspective.

Harnessing Positive Vibrations in Our Lives:

The findings from these studies present a compelling case for incorporating memes and humor into our daily lives. By actively seeking out and engaging with humorous content, we can consciously choose to lower our vibrational energy and invite positive emotions. This doesn't mean ignoring the challenges we face, but rather finding balance and a renewed perspective through moments of joy and laughter.

Conclusion:

In conclusion, the captivating world of memes has proven to have a surprising impact on our vibrational energy levels. Engaging with memes and experiencing the power of laughter can provide a much-needed reprieve from the stresses of everyday life. By embracing humor and lighthearted content, we have the opportunity to lower our vibrational energy, reduce stress, and enhance our overall well-being. So, next time you find yourself scrolling through memes, remember the transformative power of laughter and its potential to unlock positive vibrations in your life.`,
      postDate: new Date(123456),
    },
  ],
};

const _ = require("./models");
async function runTests() {
  await models.User.sync();
  await models.BlogPost.sync();
  await models.Comment.sync();
  await sequelize.sync({ force: true });

  mockData.blogposts.map(async (post) => {
    const dbPost = await models.BlogPost.create(post);
    const comments = post.comments.map(async (comment) =>
        await models.Comment.create(comment)
    );
    dbPost.addComments(comments);
  });

  return 10;
}

runTests()
  .then((ntests) => {
    console.log(`${ntests} Tests passed...`);
  })
  .catch((err) => {
    console.error("Failed running tests", err);
  });
