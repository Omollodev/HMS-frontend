// In a real application, these would call the actual API endpoints
// For now, we'll return mock data
import { apiClient } from "./api-client";

export async function getReservations(params: any = {}) {
  // This would normally be:
  const response = await apiClient.get("/reservations/", { params });
  return response.data;

  // For demonstration purpose
  return [
    {
      id: 1,
      reservation_number: "RES2301001",
      guest_name: "John Smith",
      room_number: "101",
      room_type: "Deluxe King",
      check_in_date: "2023-01-15",
      check_out_date: "2023-01-20",
      status: "checked_out",
      total_amount: 750,
    },
    {
      id: 2,
      reservation_number: "RES2301002",
      guest_name: "Jane Doe",
      room_number: "205",
      room_type: "Standard Queen",
      check_in_date: new Date().toISOString().split("T")[0], // Today
      check_out_date: "2023-01-25",
      status: "checked_in",
      total_amount: 500,
    },
    {
      id: 3,
      reservation_number: "RES2301003",
      guest_name: "Robert Johnson",
      room_number: "310",
      room_type: "Executive Suite",
      check_in_date: new Date().toISOString().split("T")[0], // Today
      check_out_date: "2023-01-28",
      status: "confirmed",
      total_amount: 1200,
    },
    {
      id: 4,
      reservation_number: "RES2301004",
      guest_name: "Sarah Williams",
      room_number: null,
      room_type: "Deluxe Twin",
      check_in_date: "2023-01-30",
      check_out_date: "2023-02-05",
      status: "pending",
      total_amount: 900,
    },
    {
      id: 5,
      reservation_number: "RES2301005",
      guest_name: "Michael Brown",
      room_number: "402",
      room_type: "Standard King",
      check_in_date: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0], // Tomorrow
      check_out_date: "2023-02-03",
      status: "confirmed",
      total_amount: 650,
    },
  ];
}

export async function getRecentReservations() {
  // This would normally call the API
  // For now, return mock data
  return [
    {
      id: 5,
      reservation_number: "RES2301005",
      guest_name: "Michael Brown",
      room_number: "402",
      check_in_date: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0],
      check_out_date: "2023-02-03",
      status: "confirmed",
    },
    {
      id: 4,
      reservation_number: "RES2301004",
      guest_name: "Sarah Williams",
      room_number: null,
      check_in_date: "2023-01-30",
      check_out_date: "2023-02-05",
      status: "pending",
    },
    {
      id: 3,
      reservation_number: "RES2301003",
      guest_name: "Robert Johnson",
      room_number: "310",
      check_in_date: new Date().toISOString().split("T")[0],
      check_out_date: "2023-01-28",
      status: "confirmed",
    },
    {
      id: 2,
      reservation_number: "RES2301002",
      guest_name: "Jane Doe",
      room_number: "205",
      check_in_date: new Date().toISOString().split("T")[0],
      check_out_date: "2023-01-25",
      status: "checked_in",
    },
    {
      id: 1,
      reservation_number: "RES2301001",
      guest_name: "John Smith",
      room_number: "101",
      check_in_date: "2023-01-15",
      check_out_date: "2023-01-20",
      status: "checked_out",
    },
  ];
}

export async function getTodayArrivals() {
  // This would normally call the API
  // For now, return mock data
  return [
    {
      id: 3,
      reservation_number: "RES2301003",
      guest_name: "Robert Johnson",
      room_number: "310",
      check_in_date: new Date().toISOString().split("T")[0],
      check_out_date: "2023-01-28",
      status: "confirmed",
      nights: 5,
    },
    {
      id: 2,
      reservation_number: "RES2301002",
      guest_name: "Jane Doe",
      room_number: "205",
      check_in_date: new Date().toISOString().split("T")[0],
      check_out_date: "2023-01-25",
      status: "confirmed",
      nights: 3,
    },
    {
      id: 6,
      reservation_number: "RES2301006",
      guest_name: "Emily Davis",
      room_number: null,
      check_in_date: new Date().toISOString().split("T")[0],
      check_out_date: "2023-01-24",
      status: "pending",
      nights: 2,
    },
  ];
}
