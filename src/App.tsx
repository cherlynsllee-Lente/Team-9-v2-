/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  INITIAL_USER_PROFILE,
  FACILITIES_DATA,
  SOCIAL_GAMES_DATA,
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
  DEMO_GROUP_PLAN,
  ALEX_PROFILE_URL,
} from './data/singaporeData';
import {
  UserProfile,
  Facility,
  SocialGame,
  ActivityBooking,
  NotificationItem,
  GroupPlan,
  SportType,
  TimeSlot,
} from './types';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { DiscoverScreen } from './components/DiscoverScreen';
import { PlanGameScreen } from './components/PlanGameScreen';
import { FindPlayersScreen } from './components/FindPlayersScreen';
import { MyActivitiesScreen } from './components/MyActivitiesScreen';
import { TalkToUsScreen } from './components/TalkToUsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { FacilityDetailModal } from './components/FacilityDetailModal';
import { GameDetailModal } from './components/GameDetailModal';
import { CreateGameModal } from './components/CreateGameModal';
import { PlayNowModal } from './components/PlayNowModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { OnboardingModal } from './components/OnboardingModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ActiveSGRedirectModal } from './components/ActiveSGRedirectModal';
import { DemoScenarioGuide } from './components/DemoScenarioGuide';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Core Data State
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [selectedLocation, setSelectedLocation] = useState<string>('Downtown Central');
  const [facilities, setFacilities] = useState<Facility[]>(FACILITIES_DATA);
  const [socialGames, setSocialGames] = useState<SocialGame[]>(SOCIAL_GAMES_DATA);
  const [bookings, setBookings] = useState<ActivityBooking[]>(INITIAL_BOOKINGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [groupPlan, setGroupPlan] = useState<GroupPlan>(DEMO_GROUP_PLAN);

  // Modals & Overlays State
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedSocialGame, setSelectedSocialGame] = useState<SocialGame | null>(null);
  const [isCreateGameOpen, setIsCreateGameOpen] = useState<boolean>(false);
  const [isPlayNowOpen, setIsPlayNowOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState<boolean>(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');

  // ActiveSG Handoff state
  const [activeSgBookingDetails, setActiveSgBookingDetails] = useState<{
    facilityName: string;
    sport: string;
    court: string;
    date: string;
    time: string;
    price: string;
    friendsCount: number;
    planId?: string;
  } | null>(null);

  // Success alert message banner
  const [globalBanner, setGlobalBanner] = useState<string | null>(null);

  const showGlobalBanner = (msg: string) => {
    setGlobalBanner(msg);
    setTimeout(() => setGlobalBanner(null), 4000);
  };

  // Trigger Demo Scenario: User wants to play badminton with 3 friends
  const handleTriggerDemoFlow = () => {
    setActiveTab('plan');
    showGlobalBanner('🏸 Step 1: Reviewing Badminton Doubles group poll with 3 friends');
  };

  // Group Plan Handoff -> ActiveSG
  const handleCompleteHandoffToActiveSG = (plan: GroupPlan) => {
    setActiveSgBookingDetails({
      facilityName: 'Kallang ActiveSG Sports Centre',
      sport: 'Badminton',
      court: 'Court 3 (Synthetic Mat)',
      date: 'Saturday, Sep 5',
      time: '10:00 AM – 11:30 AM',
      price: '$7.50 (4 Players)',
      friendsCount: 4,
      planId: plan.id,
    });
  };

  // Direct Slot Selection from Calendar / Facility -> ActiveSG
  const handleDirectSlotBooking = (slotInfo: {
    facility: Facility;
    sport: SportType;
    courtName: string;
    time: string;
    price: string;
    date: string;
  }) => {
    setSelectedFacility(null);
    setActiveSgBookingDetails({
      facilityName: slotInfo.facility.name,
      sport: slotInfo.sport,
      court: slotInfo.courtName,
      date: slotInfo.date,
      time: slotInfo.time,
      price: slotInfo.price,
      friendsCount: 1,
    });
  };

  // Facility Modal -> ActiveSG
  const handleFacilityBookSlotViaActiveSG = (facility: Facility, slot: TimeSlot) => {
    setSelectedFacility(null);
    setActiveSgBookingDetails({
      facilityName: facility.name,
      sport: facility.sports[0],
      court: slot.courtName,
      date: 'Today',
      time: slot.time,
      price: slot.price,
      friendsCount: 1,
    });
  };

  // Facility Modal -> Plan Game Here
  const handlePlanGameHere = (facility: Facility) => {
    setSelectedFacility(null);
    setActiveTab('plan');
    showGlobalBanner(`Planning game at ${facility.name}`);
  };

  // ActiveSG Booking Success Callback
  const handleActiveSgBookingSuccess = (bookingRef: string) => {
    if (!activeSgBookingDetails) return;

    // Create confirmed booking
    const newBooking: ActivityBooking = {
      id: `b-${Date.now()}`,
      sport: (activeSgBookingDetails.sport as SportType) || 'Badminton',
      title: `${activeSgBookingDetails.sport} Session`,
      venueName: activeSgBookingDetails.facilityName,
      venueAddress: '5 Stadium Walk, Singapore 397693',
      date: activeSgBookingDetails.date,
      time: activeSgBookingDetails.time,
      court: activeSgBookingDetails.court,
      status: 'Facility booked',
      players:
        activeSgBookingDetails.friendsCount > 1
          ? [
              { name: 'Alex (You)', avatar: ALEX_PROFILE_URL, status: 'Confirmed' },
              {
                name: 'Sarah',
                avatar:
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                status: 'Confirmed',
              },
              {
                name: 'John',
                avatar:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                status: 'Confirmed',
              },
              {
                name: 'Michelle',
                avatar:
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                status: 'Confirmed',
              },
            ]
          : [{ name: 'Alex (You)', avatar: ALEX_PROFILE_URL, status: 'Confirmed' }],
      isOfficialActiveSG: true,
      bookingRef,
      calendarAdded: true,
      costPerPerson:
        activeSgBookingDetails.friendsCount > 1 ? '$1.88' : activeSgBookingDetails.price,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update group plan status if linked
    if (activeSgBookingDetails.planId) {
      setGroupPlan((prev) => ({
        ...prev,
        status: 'booked',
        bookedDetails: {
          bookingRef,
          facilityName: activeSgBookingDetails.facilityName,
          slot: activeSgBookingDetails.time,
          court: activeSgBookingDetails.court,
        },
      }));
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'ActiveSG Booking Confirmed! 🏸',
      message: `Court reserved at ${activeSgBookingDetails.facilityName} (${bookingRef}). Invites sent to your squad!`,
      timeAgo: 'Just now',
      read: false,
      type: 'booking',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Close redirect modal
    setActiveSgBookingDetails(null);

    // Navigate to Activities screen to see the confirmed session
    setActiveTab('activities');
    showGlobalBanner(
      `✓ Official ActiveSG Booking Confirmed (${bookingRef})! Added to My Activities.`
    );
  };

  // Join Social Game Success
  const handleJoinSocialGameSuccess = (game: SocialGame) => {
    setSelectedSocialGame(null);
    const newBooking: ActivityBooking = {
      id: `b-game-${Date.now()}`,
      sport: game.sport,
      title: game.title,
      venueName: game.venueName,
      venueAddress: 'Singapore Community Facility',
      date: game.date,
      time: game.time,
      court: 'Reserved Social Court',
      status: 'Facility booked',
      players: [
        ...game.playerAvatars.map((p) => ({
          name: p.name,
          avatar: p.avatar,
          status: 'Confirmed' as const,
        })),
        { name: 'Alex (You)', avatar: ALEX_PROFILE_URL, status: 'Confirmed' as const },
      ],
      isOfficialActiveSG: false,
      bookingRef: `SOC-${Math.floor(1000 + Math.random() * 9000)}`,
      calendarAdded: true,
      costPerPerson: `$${game.costPerPlayer}`,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveTab('activities');
    showGlobalBanner(`Joined "${game.title}"! Added to My Activities.`);
  };

  // Host New Game Success
  const handleCreateGameSuccess = (newGame: SocialGame) => {
    setIsCreateGameOpen(false);
    setSocialGames((prev) => [newGame, ...prev]);
    showGlobalBanner(`Published "${newGame.title}" to community feed!`);
  };

  // Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    showGlobalBanner('Booking cancelled successfully.');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#050A10] text-slate-100 flex flex-col items-center selection:bg-orange-500 selection:text-white">
      {/* Mobile Device Frame Container (Mobile-first responsive shell, max 430px) */}
      <div className="w-full max-w-md min-h-screen bg-[#050A10] relative flex flex-col shadow-2xl overflow-x-hidden border-x border-slate-800">
        {/* Top Header */}
        <Header
          userProfile={userProfile}
          selectedLocation={selectedLocation}
          onSelectLocationClick={() => setIsLocationPickerOpen(true)}
          unreadNotificationsCount={unreadCount}
          onNotificationsClick={() => setIsNotificationsOpen(true)}
          onProfileClick={() => setActiveTab('profile')}
        />

        {/* Floating Global Banner Notification */}
        {globalBanner && (
          <div className="fixed top-18 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <div className="max-w-md w-full bg-orange-500 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center justify-between pointer-events-auto border border-white/20 animate-fade-in">
              <span>{globalBanner}</span>
              <button
                onClick={() => setGlobalBanner(null)}
                className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Guided Demo Scenario Banner (Unobtrusive floating companion) */}
        <DemoScenarioGuide onTriggerDemoFlow={handleTriggerDemoFlow} />

        {/* Main View Area (Based on activeTab) */}
        <main className="flex-1 px-4 pt-3">
          {activeTab === 'home' && (
            <HomeScreen
              userProfile={userProfile}
              facilities={facilities}
              socialGames={socialGames}
              onSelectFacility={(fac) => setSelectedFacility(fac)}
              onSelectSocialGame={(game) => setSelectedSocialGame(game)}
              onOpenPlayNow={() => setIsPlayNowOpen(true)}
              onOpenPlanGame={() => setActiveTab('plan')}
              onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
              onOpenSearch={(query) => {
                setSearchInitialQuery(query || '');
                setActiveTab('discover');
              }}
              onSelectSlotBooking={handleDirectSlotBooking}
            />
          )}

          {activeTab === 'discover' && (
            <DiscoverScreen
              facilities={facilities}
              onSelectFacility={(fac) => setSelectedFacility(fac)}
              initialSearchQuery={searchInitialQuery}
              onSelectSlotBooking={handleDirectSlotBooking}
            />
          )}

          {activeTab === 'plan' && (
            <PlanGameScreen
              initialPlan={groupPlan}
              facilities={facilities}
              onCompleteHandoffToActiveSG={handleCompleteHandoffToActiveSG}
              onExplorePublicGames={() => setActiveTab('discover')}
            />
          )}

          {activeTab === 'activities' && (
            <MyActivitiesScreen
              bookings={bookings}
              activePlan={groupPlan}
              onOpenPlan={() => setActiveTab('plan')}
              onOpenDirections={(venue) => {
                showGlobalBanner(`Opening directions to ${venue}...`);
              }}
              onCancelBooking={handleCancelBooking}
            />
          )}

          {activeTab === 'talk' && <TalkToUsScreen />}

          {activeTab === 'profile' && (
            <ProfileScreen
              userProfile={userProfile}
              onEditPreferences={() => setIsOnboardingOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
            />
          )}
        </main>

        {/* Bottom 5-Tab Ergonomic Navigation */}
        <Navigation
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          activitiesBadgeCount={bookings.filter((b) => b.status === 'Facility booked').length}
        />

        {/* MODAL 1: Facility Detail */}
        {selectedFacility && (
          <FacilityDetailModal
            facility={selectedFacility}
            onClose={() => setSelectedFacility(null)}
            onBookSlotViaActiveSG={handleFacilityBookSlotViaActiveSG}
            onPlanGameHere={handlePlanGameHere}
          />
        )}

        {/* MODAL 2: Social Game Detail */}
        {selectedSocialGame && (
          <GameDetailModal
            game={selectedSocialGame}
            onClose={() => setSelectedSocialGame(null)}
            onJoinSuccess={handleJoinSocialGameSuccess}
          />
        )}

        {/* MODAL 3: Create Game */}
        {isCreateGameOpen && (
          <CreateGameModal
            userProfile={userProfile}
            onClose={() => setIsCreateGameOpen(false)}
            onCreateGame={handleCreateGameSuccess}
          />
        )}

        {/* MODAL 4: Play Now Instant Activity Picker */}
        {isPlayNowOpen && (
          <PlayNowModal
            onClose={() => setIsPlayNowOpen(false)}
            onSelectFacility={(fac) => {
              setIsPlayNowOpen(false);
              setSelectedFacility(fac);
            }}
            facilities={facilities}
          />
        )}

        {/* MODAL 5: Pulse AI Assistant */}
        {isAiAssistantOpen && (
          <AiAssistantModal
            onClose={() => setIsAiAssistantOpen(false)}
            onSelectFacility={(fac) => {
              setIsAiAssistantOpen(false);
              setSelectedFacility(fac);
            }}
            onStartPlanGame={() => {
              setIsAiAssistantOpen(false);
              setActiveTab('plan');
            }}
            facilities={facilities}
          />
        )}

        {/* MODAL 6: Onboarding & User Preferences */}
        {isOnboardingOpen && (
          <OnboardingModal
            initialProfile={userProfile}
            onClose={() => setIsOnboardingOpen(false)}
            onSaveProfile={(updated) => {
              setUserProfile(updated);
              showGlobalBanner('Profile preferences updated!');
            }}
          />
        )}

        {/* MODAL 7: Notifications Drawer */}
        {isNotificationsOpen && (
          <NotificationsModal
            notifications={notifications}
            onClose={() => setIsNotificationsOpen(false)}
            onMarkAllRead={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            }}
            onNotificationAction={(n) => {
              setIsNotificationsOpen(false);
              if (n.type === 'match' || n.type === 'poll') {
                setActiveTab('plan');
              } else {
                setActiveTab('activities');
              }
            }}
          />
        )}

        {/* MODAL 8: ActiveSG Redirect / Simulated External Handoff */}
        {activeSgBookingDetails && (
          <ActiveSGRedirectModal
            bookingDetails={activeSgBookingDetails}
            onClose={() => setActiveSgBookingDetails(null)}
            onBookingSuccess={handleActiveSgBookingSuccess}
          />
        )}

        {/* MODAL 9: Quick Location Picker */}
        {isLocationPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-xs bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-800 p-4 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-sm text-slate-100">Select Location</h3>
                <button
                  onClick={() => setIsLocationPickerOpen(false)}
                  className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-1.5">
                {[
                  'Downtown Central',
                  'Boon Keng',
                  'Kallang',
                  'Bishan',
                  'Paya Lebar',
                  'Jurong West',
                  'Tampines Hub',
                ].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationPickerOpen(false);
                      showGlobalBanner(`Location updated to ${loc}`);
                    }}
                    className={`w-full py-2.5 px-3 rounded-2xl text-xs font-semibold text-left transition-colors flex items-center justify-between ${
                      selectedLocation === loc
                        ? 'bg-orange-500 text-white font-bold shadow-[0_2px_10px_rgba(249,115,22,0.4)]'
                        : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50'
                    }`}
                  >
                    <span>📍 {loc}</span>
                    {selectedLocation === loc && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

