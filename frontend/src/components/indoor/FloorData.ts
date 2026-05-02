export type Room = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "room" | "lab" | "office" | "stairs";
};

export type Floor = {
  floorNumber: number;
  rooms: Room[];
};

export const SUMANADASA_FLOORS: Floor[] = [
  {
    floorNumber: 0,
    rooms: [
       // Top Row
      { id: "ee1_1", name: "", x: 10, y: 10, width: 80, height: 120, type: "room" },
      { id: "ee1_2", name: "", x: 90, y: 10, width: 80, height: 120, type: "lab" },
      { id: "ee1_3", name: "", x: 170, y: 10, width: 110, height: 120, type: "room" },
      { id: "ee1_4", name: "", x: 280, y: 10, width: 110, height: 120, type: "lab" },
      { id: "ee1_5", name: "", x: 390, y: 10, width: 80, height: 120, type: "lab" },
      { id: "ee1_6", name: "", x: 470, y: 10, width: 70, height: 120, type: "lab" },
      { id: "ee1_7", name: "", x: 540, y: 10, width: 60, height: 120, type: "lab" },
      { id: "ee1_8", name: "", x: 600, y: 10, width: 80, height: 120, type: "lab" },
      { id: "ee1_9", name: "", x: 680, y: 10, width: 110, height: 120, type: "lab" },

      // Middle Sections
      { id: "ee1_10", name: "", x: 10, y: 130, width: 80, height: 100, type: "room" },
      { id: "ee1_11", name: "", x: 10, y: 230, width: 80, height: 100, type: "lab" },
      { id: "ee1_12", name: "", x: 110, y: 150, width: 200, height: 190, type: "room" }, // Green area
      { id: "ee1_13", name: "", x: 410, y: 150, width: 300, height: 190, type: "room" }, // Green area
      { id: "ee1_14", name: "", x: 315, y: 150, width: 60, height: 70, type: "stairs" },
      { id: "ee1_15", name: "", x: 315, y: 270, width: 60, height: 70, type: "stairs" },
      { id: "ee1_16", name: "", x: 740, y: 130, width: 50, height: 250, type: "room" }, // Green area

      // Bottom Row
      { id: "ee1_17", name: "", x: 10, y: 330, width: 80, height: 160, type: "room" },
      { id: "ee1_18", name: "", x: 90, y: 370, width: 100, height: 120, type: "office" },
      { id: "ee1_19", name: "", x: 190, y: 370, width: 200, height: 120, type: "office" },
      { id: "ee1_20", name: "", x: 390, y: 370, width: 100, height: 120, type: "lab" },
      { id: "ee1_21", name: "", x: 490, y: 370, width: 130, height: 120, type: "lab" },
      { id: "ee1_22", name: "", x: 620, y: 370, width: 170, height: 120, type: "lab" },
    ],
  },
  {
    floorNumber: 1,
    rooms: [
       // Top Row
      { id: "ee2_1", name: "", x: 10, y: 10, width: 80, height: 120, type: "room" },
      { id: "ee2_2", name: "", x: 90, y: 10, width: 80, height: 120, type: "lab" },
      { id: "ee2_3", name: "", x: 170, y: 10, width: 110, height: 120, type: "room" },
      { id: "ee2_4", name: "", x: 280, y: 10, width: 110, height: 120, type: "lab" },
      { id: "ee2_5", name: "", x: 390, y: 10, width: 80, height: 120, type: "lab" },
      { id: "ee2_6", name: "", x: 470, y: 10, width: 70, height: 120, type: "lab" },
      { id: "ee2_7", name: "", x: 540, y: 10, width: 60, height: 120, type: "lab" },
      { id: "ee2_8", name: "", x: 600, y: 10, width: 80, height: 120, type: "lab" },
      { id: "ee2_9", name: "", x: 680, y: 10, width: 110, height: 120, type: "lab" },

      // Middle Sections
      { id: "ee2_10", name: "", x: 10, y: 130, width: 80, height: 100, type: "room" },
      { id: "ee2_11", name: "", x: 10, y: 230, width: 80, height: 100, type: "lab" },
      { id: "ee2_12", name: "", x: 110, y: 150, width: 200, height: 190, type: "room" }, // Green area
      { id: "ee2_13", name: "", x: 410, y: 150, width: 300, height: 190, type: "room" }, // Green area
      { id: "ee2_14",name: "", x: 315, y: 150, width: 60, height: 70, type:"stairs" },
      { id: "ee2_15", name: "", x: 315, y: 270, width: 60, height: 70, type: "stairs" },
      { id: "ee2_16", name: "", x: 740, y: 130, width: 50, height: 250, type: "room" }, 

      // Bottom Row
      { id: "ee2_17", name: "", x: 10, y: 330, width: 80, height: 160, type: "room" },
      { id: "ee2_18", name: "", x: 90, y: 370, width: 100, height: 120, type: "office" },
      { id: "ee2_19", name: "", x: 190, y: 370, width: 200, height: 120, type: "office" },
      { id: "ee2_20", name: "", x: 390, y: 370, width: 100, height: 120, type: "lab" },
      { id: "ee2_21", name: "", x: 490, y: 370, width: 13, height: 120, type:"lab" },
      { id: "ee2_22", name: "", x: 620, y: 370, width: 170, height: 120, type: "lab" },
    ],
  },
  {
    floorNumber: 2,
    rooms: [
      // Top Row
      { id: "cse1_seminar", name: "Seminar Room", x: 10, y: 10, width: 80, height: 120, type: "room" },
      { id: "cse1_codegen", name: "CodeGen Lab", x: 90, y: 10, width: 80, height: 120, type: "lab" },
      { id: "cse1_sysco", name: "Sysco LABS Lounge", x: 170, y: 10, width: 110, height: 120, type: "room" },
      { id: "cse1_insight", name: "Insight Hub", x: 280, y: 10, width: 110, height: 120, type: "lab" },
      { id: "cse1_network", name: "Network Lab", x: 390, y: 10, width: 80, height: 120, type: "lab" },
      { id: "cse1_embedded", name: "Embedded Lab", x: 470, y: 10, width: 70, height: 120, type: "lab" },
      { id: "cse1_hpc", name: "HPC Lab", x: 540, y: 10, width: 60, height: 120, type: "lab" },
      { id: "cse1_intell", name: "IntelliSense Lab", x: 600, y: 10, width: 80, height: 120, type: "lab" },
      { id: "cse1_l3", name: "L3 Lab", x: 680, y: 10, width: 110, height: 120, type: "lab" },

      // Middle Sections
      { id: "cse1_studio", name: "Studio", x: 10, y: 130, width: 80, height: 100, type: "room" },
      { id: "cse1_oldcodegen", name: "OLD CodeGen Lab", x: 10, y: 230, width: 80, height: 100, type: "lab" },
      { id: "cse1_atrium_1", name: "Open Area", x: 110, y: 150, width: 200, height: 190, type: "room" }, // Green area
      { id: "cse1_atrium_2", name: "Open Area", x: 410, y: 150, width: 300, height: 190, type:"room" }, // Green area
      { id: "cse1_stairs_1", name: "Staircase", x: 315, y: 150, width: 60, height: 70, type: "stairs" },
      { id: "cse1_stairs_2", name: "Staircase", x: 315, y: 270, width: 60, height: 70, type: "stairs" },
      {id: "cse1_instructor", name: "Instructor room", x: 740, y: 130, width: 50, height: 240, type: "room" }, // Green area

      // Bottom Row
      { id: "cse1_server", name: "Server Room", x: 10, y: 330, width: 80, height: 160, type: "room" },
      { id: "cse1_ice", name: "ICE Room", x: 90, y: 370, width: 100, height: 120, type: "office" },
      { id: "cse1_staff2", name: "Staff Room", x: 190, y: 370, width: 200, height: 120, type: "office" },
      { id: "cse1_ra", name: "RA Lab", x: 390, y: 370, width: 100, height: 120, type: "lab" },
      { id: "cse1_gtn", name: "GTN Lab", x: 490, y: 370, width: 130, height: 120, type: "lab" },
      { id: "cse1_research", name: "Research Lab", x: 620, y: 370, width: 170, height: 120, type: "lab" },
    ],
  },
  {
    floorNumber: 3,
    rooms: [
      // Top Row
      { id: "cse2_1", name: "", x: 10, y: 10, width: 80, height: 120, type: "room" },
      { id: "cse2_2", name: "", x: 90, y: 10, width: 80, height: 120, type: "lab" },
      { id: "cse2_3", name: "", x: 170, y: 10, width: 110, height: 120, type: "room" },
      { id: "cse2_4", name: "", x: 280, y: 10, width: 110, height: 120, type: "lab" },
      { id: "cse2_5", name: "", x: 390, y: 10, width: 80, height: 120, type: "lab" },
      { id: "cse2_6", name: "", x: 470, y: 10, width: 70, height: 120, type: "lab" },
      { id: "cse2_7", name: "", x: 540, y: 10, width: 60, height: 120, type: "lab" },
      { id: "cse2_8", name: "", x: 600, y: 10, width: 80, height: 120, type: "lab" },
      { id: "cse2_9", name: "", x: 680, y: 10, width: 110, height: 120, type: "lab" },

      // Middle Sections
      { id: "cse2_10", name: "", x: 10, y: 130, width: 80, height: 100, type: "room" },
      { id: "cse2_11", name: "", x: 10, y: 230, width: 80, height: 100, type: "lab" },
      { id: "cse2_12", name: "", x: 110, y: 150, width: 200, height: 190, type: "room" }, // Green area
      { id: "cse2_13", name: "", x: 410, y: 150, width: 300, height: 190, type: "room" }, // Green area
      { id: "cse2_14", name: "", x: 315, y: 150, width: 60, height: 70, type: "stairs" },
      { id: "cse2_15", name: "", x: 315, y: 270, width: 60, height: 70, type: "stairs" },
      {id: "cse2_16", name: "", x: 740, y: 130, width: 50, height: 250, type: "room" }, // Green area

      // Bottom Row
      { id: "cse2_17", name: "", x: 10, y: 330, width: 80, height: 160, type: "room" },
      { id: "cse2_18", name: "", x: 90, y: 370, width: 100, height: 120, type: "office" },
      { id: "cse2_19", name: "", x: 190, y: 370, width: 200, height: 120, type: "office" },
      { id: "cse2_20", name: "", x: 390, y: 370, width: 100, height: 120, type: "lab" },
      { id: "cse2_21", name: "", x: 490, y: 370, width: 130, height: 120, type: "lab" },
      { id: "cse2_22", name: "", x: 620, y: 370, width: 170, height: 120, type: "lab" },
      
    ],
  },
];

export const IT_FLOORS: Floor[] = [
  { floorNumber: 0, rooms: [{ id: "it_lobby", name: "Lobby", x: 50, y: 50, width: 300, height: 200, type: "room" }, { id: "it_stairs", name: "Main Stairs", x: 400, y: 50, width: 100, height: 100, type: "stairs" }] },
  { floorNumber: 1, rooms: [{ id: "it_lab1", name: "Computer Lab 1", x: 50, y: 50, width: 250, height: 150, type: "lab" }, { id: "it_stairs", name: "Main Stairs", x: 400, y: 50, width: 100, height: 100, type: "stairs" }] },
  { floorNumber: 2, rooms: [{ id: "it_lab2", name: "Computer Lab 2", x: 50, y: 50, width: 250, height: 150, type: "lab" }, { id: "it_stairs", name: "Main Stairs", x: 400, y: 50, width: 100, height: 100, type: "stairs" }] },
  { floorNumber: 3, rooms: [{ id: "it_office", name: "Staff Office", x: 50, y: 50, width: 200, height: 150, type: "office" }, { id: "it_stairs", name: "Main Stairs", x: 400, y: 50, width: 100, height: 100, type: "stairs" }] },
  { floorNumber: 4, rooms: [{ id: "it_research", name: "Research Center", x: 50, y: 50, width: 300, height: 200, type: "lab" }, { id: "it_stairs", name: "Main Stairs", x: 400, y: 50, width: 100, height: 100, type: "stairs" }] },
  { floorNumber: 5, rooms: [{ id: "it_roof", name: "Rooftop Terrace", x: 50, y: 50, width: 400, height: 300, type: "room" }, { id: "it_stairs", name: "Main Stairs", x: 450, y: 250, width: 100, height: 100, type: "stairs" }] },
];

export const LIBRARY_FLOORS: Floor[] = [
  { floorNumber: -1, rooms: [{ id: "lib_archive", name: "Archives", x: 50, y: 50, width: 400, height: 300, type: "room" }, { id: "lib_stairs", name: "Staircase", x: 500, y: 50, width: 100, height: 100, type: "stairs" }] },
  { floorNumber: 0, rooms: [{ id: "lib_reception", name: "Reception", x: 50, y: 50, width: 200, height: 150, type: "room" }, { id: "lib_stairs", name: "Staircase", x: 300, y: 50, width: 100, height: 100, type: "stairs" }] },
  { floorNumber: 1, rooms: [{ id: "lib_reading1", name: "Reading Area A", x: 50, y: 50, width: 300, height: 250, type: "room" }, { id: "lib_stairs", name: "Staircase", x: 400, y: 50, width: 100, height: 100, type: "stairs" }] },
  { floorNumber: 2, rooms: [{ id: "lib_reading2", name: "Reading Area B", x: 50, y: 50, width: 300, height: 250, type: "room" }, { id: "lib_stairs", name: "Staircase", x: 400, y: 50, width: 100, height: 100, type: "stairs" }] },
  { floorNumber: 3, rooms: [{ id: "lib_silent", name: "Silent Study", x: 50, y: 50, width: 300, height: 250, type: "room" }, { id: "lib_stairs", name: "Staircase", x: 400, y: 50, width: 100, height: 100, type: "stairs" }] },
];