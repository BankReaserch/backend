const crypto = require("crypto");

const Subscriber = require("../models/Subscriber");
const User = require("../models/user.model");
const sendSubscriptionEmail = require("../utils/sendSubscriptionEmail");

exports.subscribe = async (user, email) => {
  if (user) {
    const dbUser = await User.findById(user.id)
      .select("email")
      .lean();

    if (!dbUser) {
      throw new Error("User not found");
    }

    const normalizedEmail = dbUser.email
      .toLowerCase()
      .trim();

    await Subscriber.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          user: user.id,
          email: normalizedEmail,
          isVerified: true,
          verificationToken: null,
          verificationExpires: null,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    return {
      status: true,
      message: "Subscribed successfully",
    };
  }
  if (!email || typeof email !== "string") {
    throw new Error("Valid email is required");
  }

  const normalizedEmail = email
    .toLowerCase()
    .trim();

  // Basic validation
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    throw new Error("Invalid email address");
  }

  const existing = await Subscriber.findOne({
    email: normalizedEmail,
  }).lean();

  // Do not reveal subscription status
  if (existing?.isVerified) {
    return {
      status: true,
      message:
        "If this email can receive subscriptions, a verification email has been sent.",
    };
  }

    const token = crypto
    .randomBytes(32)
    .toString("hex");

  const expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  await Subscriber.findOneAndUpdate(
    {
      email: normalizedEmail,
    },
    {
      $set: {
        email: normalizedEmail,
        verificationToken: token,
        verificationExpires: expiresAt,
        isVerified: false,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  const verifyUrl =
    `${process.env.BACKEND_URL}` +
    `/api/subscribers/verify/${token}`;

  await sendSubscriptionEmail(
    normalizedEmail,
    verifyUrl
  );

  return {
    status: true,
    message:
      "If this email can receive subscriptions, a verification email has been sent.",
  };
};

// service
exports.verifySubscription = async (token) => {
  const subscriber = await Subscriber.findOne({
    verificationToken: token,
    verificationExpires: {
      $gt: new Date(),
    },
  });

  if (!subscriber) {
    throw new Error("Invalid token");
  }

  subscriber.isVerified = true;
  subscriber.verificationToken = null;
  subscriber.verificationExpires = null;

  await subscriber.save();

  return subscriber;
};

exports.unsubscribe = async (email) => {

    await Subscriber.deleteOne({
        email,
    });

    return true;
};

exports.getAllSubscribers = async () => {
  const subscribers =
    await Subscriber.find()
      .populate(
        "user",
        "email"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

  return subscribers.map(
    (subscriber) => ({
      _id: subscriber._id,
      email: subscriber.email,
      isVerified:
        subscriber.isVerified,
      createdAt:
        subscriber.createdAt,
      updatedAt:
        subscriber.updatedAt,

      source: subscriber.user
        ? "Registered User"
        : "Guest",

      user: subscriber.user
        ? {
            _id:
              subscriber.user._id,
            email:
              subscriber.user.email,
          }
        : null,
    })
  );
};