// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SectionList, // <-- SectionList use karein
//   Modal,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// // Zyada mock data, alag-alag dates ke saath
// const allJournalsData = [
//   {
//     title: "October 2025",
//     data: [
//       {
//         id: 1,
//         title: "Amazing Study Session Today",
//         date: "Sunday, October 26, 2025",
//         content: "Had such a productive day!...",
//         grateful: "My study group",
//         accomplished: "3 chapters of calculus",
//         mood: "😊",
//         tag: "amazing",
//       },
//       {
//         id: 2,
//         title: "Feeling a bit stuck",
//         date: "Friday, October 24, 2025",
//         content: "Couldn't focus today. Tried to read...",
//         grateful: "A good cup of tea",
//         accomplished: "10 pages of reading",
//         mood: "😟",
//         tag: "stuck",
//       },
//     ],
//   },
//   {
//     title: "September 2025",
//     data: [
//       {
//         id: 3,
//         title: "First day of new semester",
//         date: "Monday, September 1, 2025",
//         content: "Excited for the new classes. Met my professors...",
//         grateful: "New beginnings",
//         accomplished: "Organized my schedule",
//         mood: "🤩",
//         tag: "new",
//       },
//     ],
//   },
// ];

// // Dropdown ke liye mock options
// const MONTHS = [
//   "All Months", "October 2025", "September 2025", "August 2025"
// ];

// export default function AllJournals() {
//   const navigation = useNavigation();
//   const [journals, setJournals] = useState(allJournalsData);
//   const [filterModalVisible, setFilterModalVisible] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState("All Months");

//   const handleFilterSelect = (month) => {
//     setSelectedMonth(month);
//     setFilterModalVisible(false);
//     // Yahaan hum backend se filter karne ka logic likhenge
//     if (month === "All Months") {
//       setJournals(allJournalsData);
//     } else {
//       setJournals(allJournalsData.filter(section => section.title === month));
//     }
//   };

//   // Har section ke header ko render karein
//   const renderSectionHeader = ({ section: { title } }) => (
//     <Text style={styles.sectionHeader}>{title}</Text>
//   );

//   // Har journal entry ko render karein
//   const renderJournalItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <Text style={styles.cardTitle}>{item.title}</Text>
//         <Text style={styles.mood}>{item.mood}</Text>
//       </View>
//       <Text style={styles.cardDate}>{item.date}</Text>
//       <Text style={styles.cardContent}>{item.content}</Text>
//       <Text style={styles.cardFooter}>
//         <Text style={{ fontWeight: "bold" }}>Grateful for: </Text>
//         {item.grateful}
//       </Text>
//       <Text style={styles.cardFooter}>
//         <Text style={{ fontWeight: "bold" }}>Accomplished: </Text>
//         {item.accomplished}
//       </Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={{ color: '#fff', fontSize: 24 }}>‹</Text>
//         </TouchableOpacity>
//         <Text style={styles.title}>All Journals</Text>
//         <View style={{ width: 50 }} />
//       </View>

//       {/* Filter Dropdown (Mock) */}
//       <TouchableOpacity
//         style={styles.filterButton}
//         onPress={() => setFilterModalVisible(true)}
//       >
//         <Text style={styles.filterText}>{selectedMonth}</Text>
//         <Text style={styles.filterIcon}>▼</Text>
//       </TouchableOpacity>

//       {/* Journals List */}
//       <SectionList
//         sections={journals}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderJournalItem}
//         renderSectionHeader={renderSectionHeader}
//         style={styles.journalList}
//       />

//       {/* Month Filter Modal */}
//       <Modal visible={filterModalVisible} animationType="fade" transparent={true}>
//         <TouchableOpacity 
//           style={styles.modalContainer} 
//           activeOpacity={1} 
//           onPress={() => setFilterModalVisible(false)} // Bahar click karke band karein
//         >
//           <View style={styles.modalContent}>
//             {MONTHS.map((month) => (
//               <TouchableOpacity
//                 key={month}
//                 style={styles.modalOption}
//                 onPress={() => handleFilterSelect(month)}
//               >
//                 <Text style={styles.modalOptionText}>{month}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     paddingTop: 0,
//   },
//   header: {
//     height: 60,
//     paddingHorizontal: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#0E0E10',
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   backBtn: {
//     padding: 8,
//     width: 50,
//     alignItems: 'flex-start',
//   },
//   title: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 18,
//   },
//   filterButton: {
//     backgroundColor: '#1a1a1a',
//     padding: 12,
//     borderRadius: 10,
//     margin: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   filterText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   filterIcon: {
//     color: '#fff',
//   },
//   journalList: {
//     paddingHorizontal: 20,
//   },
//   sectionHeader: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     backgroundColor: '#000',
//     paddingVertical: 10,
//   },
//   card: {
//     backgroundColor: "#1a1a1a",
//     padding: 15,
//     borderRadius: 15,
//     marginBottom: 15,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//     flex: 1,
//   },
//   mood: {
//     fontSize: 20,
//     marginRight: 5,
//   },
//   cardDate: {
//     color: "#aaa",
//     fontSize: 13,
//     marginVertical: 5,
//   },
//   cardContent: {
//     color: "#ddd",
//     marginBottom: 8,
//   },
//   cardFooter: {
//     color: "#bbb",
//     fontSize: 13,
//     marginTop: 2,
//   },
//   // Modal Styles
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     justifyContent: "center",
//     padding: 40,
//   },
//   modalContent: {
//     backgroundColor: "#2a2a2a",
//     borderRadius: 15,
//     padding: 10,
//   },
//   modalOption: {
//     padding: 15,
//   },
//   modalOptionText: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });




import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SectionList, // <-- SectionList use karein
  Modal,
  ActivityIndicator, // <-- Loading ke liye
  Alert, // <-- Errors ke liye
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // <-- useFocusEffect add kiya
import { getAllEntries } from '../services/journalApi'; // <-- API function import karein

// Helper Function: Backend se mile data ko SectionList ke liye group karega
const processAndGroupData = (entries) => {
  if (!entries || entries.length === 0) return [];

  // 1. Entries ko group karein (e.g., {"October 2025": [...], "September 2025": [...]})
  const grouped = {};
  entries.forEach(entry => {
    // API se date 'YYYY-MM-DD' format mein aati hai
    // Note: Date() constructor UTC/local time issues de sakta hai, isliye string split karna reliable hai
    const parts = entry.date.split('-'); // [YYYY, MM, DD]
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1; // Date() mein month 0-indexed hota hai
    
    const dateObj = new Date(year, monthIndex, parseInt(parts[2], 10));
    
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const sectionTitle = `${month} ${year}`;

    if (!grouped[sectionTitle]) {
      grouped[sectionTitle] = [];
    }
    grouped[sectionTitle].push(entry);
  });

  // 2. Object ko array mein convert karein
  // e.g., [{ title: "October 2025", data: [...] }, ...]
  return Object.keys(grouped).map(title => ({
    title: title,
    data: grouped[title],
  }));
};

// Helper Function: Dropdown ke liye pichhle 12 mahine generate karega
const generateMonthOptions = () => {
  const options = ["All Months"];
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    // Har pichhle mahine ki 1st date
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    options.push(`${month} ${year}`);
  }
  return options;
};

// Dropdown ke liye dynamic options
const MONTHS = generateMonthOptions();

export default function AllJournals() {
  const navigation = useNavigation();
  const [journals, setJournals] = useState([]); // Mock data hata diya
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [loading, setLoading] = useState(true); // Default true rakhein

  // Data fetch karne wala main function
  const fetchJournals = async (month, year) => {
    setLoading(true);
    try {
      console.log(`Fetching journals for month: ${month}, year: ${year}`);
      const response = await getAllEntries(month, year); // API call
      if (response.success) {
        const groupedData = processAndGroupData(response.data); // Data ko group karein
        setJournals(groupedData);
      } else {
        Alert.alert("Error", response.error || "Could not fetch journals.");
      }
    } catch (error) {
      console.error("Fetch journals error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect ka istemaal karein taaki jab bhi screen par waapas aayein, data refresh ho
  useFocusEffect(
    React.useCallback(() => {
      // Current filter ke hisaab se data fetch karein
      handleFilterSelect(selectedMonth, true); // true = initial load
    }, [])
  );

  // Filter select karne par yeh function chalega
  const handleFilterSelect = async (monthLabel, isInitialLoad = false) => {
    if (!isInitialLoad) {
      setFilterModalVisible(false); // Modal band karein
    }
    setSelectedMonth(monthLabel);
    
    if (monthLabel === "All Months") {
      await fetchJournals(null, null); // Sabhi entries fetch karein
    } else {
      // "October 2025" ko parse karein
      const parts = monthLabel.split(' ');
      const monthName = parts[0];
      const year = parseInt(parts[1], 10);
      
      // Month ke naam ko number (1-12) mein convert karein
      // (JS mein Date() ko month name samajhne ke liye ' 1, 2025' add karna padta hai)
      const month = new Date(Date.parse(monthName + " 1, 2025")).getMonth() + 1; 
      
      await fetchJournals(month, year); // Filtered data fetch karein
    }
  };

  // Har section ke header ko render karein
  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  // Har journal entry ko render karein (mood aur tag hata diya)
  const renderJournalItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {/* Mood hata diya */}
      </View>
      <Text style={styles.cardDate}>{new Date(item.date).toDateString()}</Text>
      <Text style={styles.cardContent}>{item.content}</Text>
      {/* Grateful aur Accomplished ko conditionally render karein */}
      {item.grateful && (
        <Text style={styles.cardFooter}>
          <Text style={{ fontWeight: "bold" }}>Grateful for: </Text>
          {item.grateful}
        </Text>
      )}
      {item.accomplished && (
        <Text style={styles.cardFooter}>
          <Text style={{ fontWeight: "bold" }}>Accomplished: </Text>
          {item.accomplished}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: '#fff', fontSize: 24 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>All Journals</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Filter Dropdown */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterModalVisible(true)}
      >
        <Text style={styles.filterText}>{selectedMonth}</Text>
        <Text style={styles.filterIcon}>▼</Text>
      </TouchableOpacity>

      {/* Journals List (Loading state ke saath) */}
      {loading ? (
        <ActivityIndicator size="large" color="#7c3aed" style={{ marginTop: 50 }} />
      ) : (
        <SectionList
          sections={journals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderJournalItem}
          renderSectionHeader={renderSectionHeader}
          style={styles.journalList}
          ListEmptyComponent={() => ( // Khaali list ke liye message
            <Text style={styles.emptyText}>No journal entries found for this period.</Text>
          )}
        />
      )}

      {/* Month Filter Modal (Dynamic options) */}
      <Modal visible={filterModalVisible} animationType="fade" transparent={true}>
        <TouchableOpacity 
          style={styles.modalContainer} 
          activeOpacity={1} 
          onPress={() => setFilterModalVisible(false)} // Bahar click karke band karein
        >
          <View style={styles.modalContent}>
            {MONTHS.map((month) => (
              <TouchableOpacity
                key={month}
                style={styles.modalOption}
                onPress={() => handleFilterSelect(month)}
              >
                <Text style={styles.modalOptionText}>{month}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// Styles (Naya 'emptyText' style add kiya hai)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 0,
  },
  header: {
    height: 60,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0E0E10',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backBtn: {
    padding: 8,
    width: 50,
    alignItems: 'flex-start',
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  filterButton: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 10,
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterIcon: {
    color: '#fff',
  },
  journalList: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#000',
    paddingVertical: 10,
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  cardDate: {
    color: "#aaa",
    fontSize: 13,
    marginVertical: 5,
  },
  cardContent: {
    color: "#ddd",
    marginBottom: 8,
  },
  cardFooter: {
    color: "#bbb",
    fontSize: 13,
    marginTop: 2,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 40,
  },
  modalContent: {
    backgroundColor: "#2a2a2a",
    borderRadius: 15,
    padding: 10,
  },
  modalOption: {
    padding: 15,
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: { // <-- Naya style
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  }
});

