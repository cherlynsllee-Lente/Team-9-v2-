export type SportType =
  | 'Badminton'
  | 'Pickleball'
  | 'Tennis'
  | 'Basketball'
  | 'Swimming'
  | 'Gym'
  | 'Football'
  | 'Table Tennis'
  | 'Running'
  | 'Fitness Classes'
  | 'Pilates'
  | 'Boxing'
  | 'Yoga'
  | 'Other';

export type ExerciseFrequency =
  | 'Less than once a week'
  | 'Once a week'
  | '2–3 times a week'
  | '4–6 times a week'
  | 'Daily';

export type ExerciseTime =
  | 'Before work'
  | 'Morning'
  | 'Lunch time'
  | 'Afternoon'
  | 'After work'
  | 'Evening'
  | 'Weekends';

export type SkillLevel = 'Beginner' | 'Recreational' | 'Intermediate' | 'Advanced';

export interface UserProfile {
  name: string;
  avatar: string;
  email: string;
  preferredSports: SportType[];
  exerciseFrequency: ExerciseFrequency;
  preferredTimes: ExerciseTime[];
  preferredLocation: string;
  maxDistanceKm: number;
  skillLevel: SkillLevel;
  monthlyStats: {
    totalActivities: number;
    sportsBreakdown: { sport: SportType; count: number }[];
    streakWeeks: number;
    monthlyGoalTarget: number;
  };
}

export interface TimeSlot {
  id: string;
  time: string;
  endTime: string;
  status: 'available' | 'limited' | 'full';
  price: string;
  courtName: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'activesg' | 'private' | 'community';
  sports: SportType[];
  address: string;
  neighbourhood: string;
  distanceKm: number;
  lat: number;
  lng: number;
  openingHours: string;
  amenities: string[];
  nearestMrt: string;
  parkingInfo: string;
  imageUrl: string;
  priceEstimate: string;
  pricePerPlayer?: string;
  activeSgEligible: boolean;
  rating: number;
  reviewsCount: number;
  todaySlots: TimeSlot[];
  indoor: boolean;
  crowdLevel?: 'Low crowd expected' | 'Moderate' | 'Peak hours';
}

export interface SocialGame {
  id: string;
  title: string;
  sport: SportType;
  venueId: string;
  venueName: string;
  neighbourhood: string;
  date: string;
  time: string;
  endTime: string;
  skillLevel: SkillLevel;
  playersJoined: number;
  totalPlayers: number;
  playerAvatars: { name: string; avatar: string }[];
  costPerPlayer: number;
  totalCourtCost: number;
  isPublic: boolean;
  description: string;
  organiserName: string;
  organiserAvatar: string;
  organiserRating: number;
  attendanceRate: number;
  intensity?: 'Casual' | 'Competitive' | 'Social';
  genderPreference?: 'All welcome' | 'Men only' | 'Women only' | 'Mixed';
}

export interface PollOption {
  id: string;
  dayText: string;
  dateText: string;
  timeSlot: string;
  votes: { [friendName: string]: boolean };
}

export interface GroupPlan {
  id: string;
  sport: SportType;
  organiser: string;
  playersNeeded: number;
  preferredDates: string[];
  preferredTime: string;
  locationArea: string;
  maxDistanceKm: number;
  status: 'draft' | 'poll_sent' | 'best_match_ready' | 'booked';
  pollOptions: PollOption[];
  friends: { name: string; avatar: string; responded: boolean }[];
  bestMatch?: {
    dayText: string;
    dateText: string;
    timeSlot: string;
    availableCount: number;
    recommendedFacility: Facility;
    selectedSlot: TimeSlot;
  };
}

export interface ActivityBooking {
  id: string;
  sport: SportType;
  title: string;
  venueName: string;
  venueAddress: string;
  date: string;
  time: string;
  court: string;
  status: 'Facility booked' | 'Pending poll' | 'Completed';
  players: { name: string; avatar: string; status: 'Confirmed' | 'Invited' }[];
  isOfficialActiveSG: boolean;
  bookingRef: string;
  calendarAdded: boolean;
  costPerPerson: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: 'booking' | 'poll' | 'match' | 'alert' | 'reminder';
}
