// In a real application, these would call the actual API endpoints
// For now, we'll return mock data

export async function getRooms(params: any = {}) {
  // This would normally be:
  // const response = await apiClient.get('/rooms/', { params })
  // return response.data

  // Mock data for demonstration
  const rooms = [
    {
      id: 1,
      number: "101",
      floor: 1,
      type: "Standard King",
      status: "available",
      price: 120,
      features: ["King Bed", "Wi-Fi", "TV", "Air Conditioning"],
    },
    {
      id: 2,
      number: "102",
      floor: 1,
      type: "Standard Twin",
      status: "occupied",
      price: 120,
      features: ["Twin Beds", "Wi-Fi", "TV", "Air Conditioning"],
    },
    {
      id: 3,
      number: "103",
      floor: 1,
      type: "Deluxe King",
      status: "cleaning",
      price: 150,
      features: ["King Bed", "Wi-Fi", "TV", "Mini Bar", "Balcony"],
    },
    {
      id: 4,
      number: "201",
      floor: 2,
      type: "Deluxe Twin",
      status: "available",
      price: 150,
      features: ["Twin Beds", "Wi-Fi", "TV", "Mini Bar", "Balcony"],
    },
    {
      id: 5,
      number: "202",
      floor: 2,
      type: "Executive Suite",
      status: "reserved",
      price: 250,
      features: ["King Bed", "Sofa", "Wi-Fi", "TV", "Mini Bar", "Balcony", "Jacuzzi"],
    },
    {
      id: 6,
      number: "203",
      floor: 2,
      type: "Executive Suite",
      status: "maintenance",
      price: 250,
      features: ["King Bed", "Sofa", "Wi-Fi", "TV", "Mini Bar", "Balcony", "Jacuzzi"],
    },
    {
      id: 7,
      number: "301",
      floor: 3,
      type: "Presidential Suite",
      status: "available",
      price: 500,
      features: ["King Bed", "Living Room", "Dining Area", "Wi-Fi", "TV", "Mini Bar", "Balcony", "Jacuzzi"],
    },
    {
      id: 8,
      number: "302",
      floor: 3,
      type: "Deluxe King",
      status: "available",
      price: 150,
      features: ["King Bed", "Wi-Fi", "TV", "Mini Bar", "Balcony"],
    },
  ]

  // Apply filters
  let filteredRooms = [...rooms]

  if (params.status) {
    filteredRooms = filteredRooms.filter((room) => room.status === params.status)
  }

  if (params.room_type) {
    filteredRooms = filteredRooms.filter((room) => room.type.toLowerCase().includes(params.room_type.toLowerCase()))
  }

  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredRooms = filteredRooms.filter(
      (room) => room.number.toLowerCase().includes(searchTerm) || room.type.toLowerCase().includes(searchTerm),
    )
  }

  return filteredRooms
}

