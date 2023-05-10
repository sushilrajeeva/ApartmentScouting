import {ObjectId} from 'mongodb';
import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const CommonPassword = '$2a$12$UjnXXbPWoyFdd0ERBmmKROTggmQresi7NcG/gUGQZZzuMmEAxFxEC';

// "" Cs546$Password "" This is the password for the all user to login to application. While using the data provided in he seed.js file.

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db('Apartment_Scouting_DB');
    //If you are a windows user change the serverURL to 'mongodb://127.0.0.1:27017'

    const firstNames = ['Aarav', 'Bhavya', 'Chirag', 'Devansh', 'Eshaan', 'Firoz', 'Gauri', 'Hari', 'Isha', 'Jyoti'];
    const lastNames = ['Patel', 'Shah', 'Singh', 'Kumar', 'Gupta', 'Jain', 'Desai', 'Mehta', 'Verma', 'Malhotra'];

    const primaryUsers = Array.from({ length: 20 }, (_, i) => ({
      _id: new ObjectId(),
      firstName: firstNames[i % 10],
      middleName: '',
      lastName: lastNames[i % 10],
      emailAddress: `primaryuser${i + 1}@example.com`,
      countryCode: '+1',
      phoneNumber: `5551234${String(i).padStart(3, '0')}`,
      city: 'Jersey City',
      state: 'New Jersey',
      country: 'United States',
      dob: `2000-01-${String(i + 1).padStart(2, '0')}`,
      role: 'primary user',
      password: CommonPassword,
      listings: [],
      wallet: 1000,
    }));

    const scoutUsers = Array.from({ length: 10 }, (_, i) => ({
      _id: new ObjectId(),
      firstName: firstNames[(i + 5) % 10],
      middleName: '',
      lastName: lastNames[(i + 5) % 10],
      emailAddress: `scoutuser${i + 1}@example.com`,
      countryCode: '+1',
      phoneNumber: `5555678${String(i).padStart(3, '0')}`,
      city: 'Jersey City',
      state: 'New Jersey',
      country: 'United States',
      dob: `2000-02-${String(i + 1).padStart(2, '0')}`,
      role: 'scout user',
      password: CommonPassword,
      subscribedlistings: [],
      wallet: 1000,
    }));

    const listings = Array.from({ length: 100 }, (_, i) => {
      const primaryUserIndex = Math.floor(i / 5);
      return {
        _id: new ObjectId(),
        userID: primaryUsers[primaryUserIndex]._id,
        listingName: `Home ${i + 1}`,
        listingLink: `https://www.example.com/listing${i + 1}`,
        street: `Newkirk Street ${i + 1}`,
        city: 'JSQ',
        state: 'New Jersey',
        country: 'United States',
        pincode: `0000${i}`,
        rent: `${10 * (i + 1)}`,
        additionalInfo: 'NA',
        agentNumber: `0000000${i}`,
        ownerNumber: `1111111${i}`,
        reward: `${11 * (i + 1)}`,
        progressbar: 25,
        scoutID: i < 50 ? scoutUsers[i % 10]._id : null,
        messageID: '',
      };
    });

    primaryUsers.forEach((user, i) => {
      for (let j = 0; j < 5; j++) {
        user.listings.push(listings[i * 5 + j]._id);
      }
    });

    scoutUsers.forEach((user, i) => {
      for (let j = 0; j < 5; j++) {
        user.subscribedlistings.push({ listingID: listings[i * 5 + j]._id, active: true });
      }
    });

    const messages = listings.slice(0, 50).map((listing, i) => {
      const primaryUser = primaryUsers[Math.floor(i / 5)];
      const scoutUser = scoutUsers[i % 10];

      return {
        _id: new ObjectId(),
        listingID: listing._id,
        comments: [
          {
            userID: primaryUser._id,
            scoutID: scoutUser._id,
            commenterId: primaryUser._id,
            comment: `Comment from primary user ${primaryUser.firstName} on listing ${listing.listingName}`,
            timestamp: new Date(),
          },
          {
            userID: primaryUser._id,
            scoutID: scoutUser._id,
            commenterId: scoutUser._id,
            comment: `Comment from scout user ${scoutUser.firstName} on listing ${listing.listingName}`,
            timestamp: new Date(),
          },
        ],
      };
    });

    // Update listings with messageID
    messages.forEach((message, i) => {
      listings[i].messageID = message._id;
    });

    await db.collection('primaryUsers').insertMany(primaryUsers);
    await db.collection('scoutUsers').insertMany(scoutUsers);
    await db.collection('listings').insertMany(listings);
    await db.collection('messages').insertMany(messages);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    client.close();
  }
}

seedDatabase();
