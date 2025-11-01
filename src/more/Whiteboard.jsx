// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   Linking,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Svg, { Path } from "react-native-svg";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import ViewShot from "react-native-view-shot";
// import CameraRoll from '@react-native-camera-roll/camera-roll';

// // Colors aur Brush sizes
// const COLORS = ["#FFFFFF", "#f87171", "#a78bfa", "#34d399", "#fbbf24", "#60a5fa", "#ec4899"];
// const BRUSH_SIZES = [
//   { id: "small", size: 3, label: "S" },
//   { id: "medium", size: 8, label: "M" },
//   { id: "large", size: 15, label: "L" },
// ];

// const { height, width } = Dimensions.get("window");

// export default function Whiteboard() {
//   const navigation = useNavigation();
//   const viewShotRef = useRef();

//   const [paths, setPaths] = useState([]);
//   const [currentPath, setCurrentPath] = useState(null);
//   const [currentColor, setCurrentColor] = useState(COLORS[0]);
//   const [currentStrokeWidth, setCurrentStrokeWidth] = useState(BRUSH_SIZES[1].size);
//   const [permissionGranted, setPermissionGranted] = useState(false);

//   // ===== Touch Events =====
//   const onTouchStart = (event) => {
//     const { locationX, locationY } = event.nativeEvent;
//     const newPath = {
//       segments: [`M${locationX.toFixed(2)},${locationY.toFixed(2)}`],
//       color: currentColor,
//       strokeWidth: currentStrokeWidth,
//     };
//     setCurrentPath(newPath);
//   };

//   const onTouchMove = (event) => {
//     if (!currentPath) return;
//     const { locationX, locationY } = event.nativeEvent;
//     const newSegment = `L${locationX.toFixed(2)},${locationY.toFixed(2)}`;
    
//     setCurrentPath(prev => ({
//       ...prev,
//       segments: [...prev.segments, newSegment],
//     }));
//   };

//   const onTouchEnd = () => {
//     if (currentPath) {
//       setPaths([...paths, currentPath]);
//     }
//     setCurrentPath(null);
//   };

//   // ===== Undo =====
//   const onUndo = () => {
//     if (paths.length > 0) {
//       setPaths(paths.slice(0, -1));
//     }
//   };

//   // ===== Clear All =====
//   const onClearAll = () => {
//     Alert.alert(
//       "Clear Canvas",
//       "Are you sure you want to clear everything?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Clear", 
//           style: "destructive",
//           onPress: () => {
//             setPaths([]);
//             setCurrentPath(null);
//           }
//         }
//       ]
//     );
//   };

//   // ===== Check & Request Permission =====
//   const checkAndRequestPermission = async () => {
//     if (Platform.OS === 'android') {
//       // Android 13+ (API 33+) uses different permission
//       const androidVersion = Platform.Version;
      
//       if (androidVersion >= 33) {
//         // Android 13+ - READ_MEDIA_IMAGES permission
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//           {
//             title: "Storage Permission Required",
//             message: "App needs access to save your drawings to gallery.",
//             buttonPositive: "Allow",
//             buttonNegative: "Deny"
//           }
//         );
        
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           setPermissionGranted(true);
//           return true;
//         } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
//           // User ne "Don't ask again" select kiya
//           Alert.alert(
//             "Permission Required",
//             "Storage permission is required to save drawings. Please enable it from Settings.",
//             [
//               { text: "Cancel", style: "cancel" },
//               { 
//                 text: "Open Settings", 
//                 onPress: () => Linking.openSettings()
//               }
//             ]
//           );
//           return false;
//         } else {
//           Alert.alert("Permission Denied", "Cannot save drawing without storage permission.");
//           return false;
//         }
//       } else {
//         // Android 12 and below - WRITE_EXTERNAL_STORAGE
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: "Storage Permission Required",
//             message: "App needs access to save your drawings to gallery.",
//             buttonPositive: "Allow",
//             buttonNegative: "Deny"
//           }
//         );
        
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           setPermissionGranted(true);
//           return true;
//         } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
//           Alert.alert(
//             "Permission Required",
//             "Storage permission is required to save drawings. Please enable it from Settings.",
//             [
//               { text: "Cancel", style: "cancel" },
//               { 
//                 text: "Open Settings", 
//                 onPress: () => Linking.openSettings()
//               }
//             ]
//           );
//           return false;
//         } else {
//           Alert.alert("Permission Denied", "Cannot save drawing without storage permission.");
//           return false;
//         }
//       }
//     }
//     return true; // iOS doesn't need permission for CameraRoll.save
//   };

//   // ===== Save Drawing =====
//   const onSave = async () => {
//     try {
//       // Check if there's anything to save
//       if (paths.length === 0 && !currentPath) {
//         Alert.alert("Nothing to Save", "Please draw something first!");
//         return;
//       }

//       // Check permission (only asks first time or if denied)
//       if (!permissionGranted) {
//         const hasPermission = await checkAndRequestPermission();
//         if (!hasPermission) return;
//       }

//       // Capture screenshot
//       const uri = await viewShotRef.current.capture();

//       // Save to gallery
//       await CameraRoll.save(uri, { type: 'photo' });
      
//       Alert.alert(
//         "Saved! ✅",
//         "Your drawing has been saved to your gallery.",
//         [{ text: "OK" }]
//       );

//     } catch (error) {
//       console.error("Error saving drawing:", error);
//       Alert.alert("Error", "Could not save drawing. Please try again.");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor="#050405" />
      
//       {/* ===== Modern Header ===== */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={{ color: '#fff', fontSize: 24 }}>‹</Text>
//         </TouchableOpacity>
//         <Text style={styles.title}>Whiteboard</Text>
//         <View style={{ width: 50 }} />
//       </View>

//       {/* ===== Toolbar at Top ===== */}
//       <View style={styles.toolbar}>
//         {/* Color Palette */}
//         <View style={styles.toolSection}>
//           <Text style={styles.toolTitle}>Colors</Text>
//           <View style={styles.colorPalette}>
//             {COLORS.map((color) => (
//               <TouchableOpacity
//                 key={color}
//                 style={[
//                   styles.colorOption,
//                   { backgroundColor: color },
//                   currentColor === color && styles.colorActive
//                 ]}
//                 onPress={() => setCurrentColor(color)}
//               >
//                 {currentColor === color && (
//                   <Icon name="check" size={14} color={color === '#FFFFFF' ? '#000' : '#fff'} />
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
        
//         {/* Brush Sizes */}
//         <View style={styles.toolSection}>
//           <Text style={styles.toolTitle}>Brush</Text>
//           <View style={styles.brushPalette}>
//             {BRUSH_SIZES.map((brush) => (
//               <TouchableOpacity
//                 key={brush.id}
//                 style={[
//                   styles.brushOption,
//                   currentStrokeWidth === brush.size && styles.brushActive
//                 ]}
//                 onPress={() => setCurrentStrokeWidth(brush.size)}
//               >
//                 <Text style={[
//                   styles.brushLabel,
//                   currentStrokeWidth === brush.size && styles.brushLabelActive
//                 ]}>
//                   {brush.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionSection}>
//           <TouchableOpacity 
//             style={styles.actionButton} 
//             onPress={onUndo}
//             disabled={paths.length === 0}
//           >
//             <Icon name="undo" size={20} color={paths.length === 0 ? '#555' : '#fff'} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionButton} onPress={onClearAll}>
//             <Icon name="delete-sweep" size={20} color="#ff6b6b" />
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={onSave}>
//             <Icon name="content-save" size={20} color="#fff" />
//             <Text style={styles.saveText}>Save</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* ===== Drawing Area ===== */}
//       <ViewShot 
//         ref={viewShotRef} 
//         options={{ format: 'png', quality: 1.0 }} 
//         style={styles.drawingArea}
//       >
//         <View
//           style={styles.svgContainer}
//           onTouchStart={onTouchStart}
//           onTouchMove={onTouchMove}
//           onTouchEnd={onTouchEnd}
//         >
//           <Svg height="100%" width="100%">
//             {/* Previous paths */}
//             {paths.map((path, index) => (
//               <Path
//                 key={`path-${index}`}
//                 d={path.segments.join(' ')}
//                 stroke={path.color}
//                 strokeWidth={path.strokeWidth}
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             ))}
//             {/* Current path being drawn */}
//             {currentPath && (
//               <Path
//                 d={currentPath.segments.join(' ')}
//                 stroke={currentPath.color}
//                 strokeWidth={currentPath.strokeWidth}
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             )}
//           </Svg>
//         </View>
//       </ViewShot>

//       {/* ===== Status Info (Bottom) ===== */}
//       <View style={styles.statusBar}>
//         <View style={styles.statusItem}>
//           <View style={[styles.currentColorIndicator, { backgroundColor: currentColor }]} />
//           <Text style={styles.statusText}>
//             {BRUSH_SIZES.find(b => b.size === currentStrokeWidth)?.label} Brush
//           </Text>
//         </View>
//         <Text style={styles.statusText}>{paths.length} strokes</Text>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#050405",
//   },
//   header: {
//     height: 60,
//     paddingHorizontal: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#0E0E10',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 255, 255, 0.05)',
//   },
//   backBtn: {
//     padding: 8,
//     width: 50,
//     alignItems: 'center',
//   },
//   title: {
//     color: '#fff',
//     fontWeight: '800',
//     fontSize: 18,
//     letterSpacing: -0.3,
//   },

//   // Toolbar (Top)
//   toolbar: {
//     backgroundColor: '#0E0E10',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 255, 255, 0.05)',
//     padding: 12,
//     paddingBottom: 16,
//   },
//   toolSection: {
//     marginBottom: 12,
//   },
//   toolTitle: {
//     color: '#9CA3AF',
//     fontSize: 11,
//     fontWeight: '700',
//     marginBottom: 8,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },

//   // Colors
//   colorPalette: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   colorOption: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     borderWidth: 2,
//     borderColor: 'transparent',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   colorActive: {
//     borderColor: '#a78bfa',
//     borderWidth: 3,
//   },

//   // Brushes
//   brushPalette: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   brushOption: {
//     width: 44,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: '#151517',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   brushActive: {
//     backgroundColor: '#a78bfa',
//     borderColor: '#c4b5fd',
//   },
//   brushLabel: {
//     color: '#9CA3AF',
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   brushLabelActive: {
//     color: '#fff',
//   },

//   // Actions
//   actionSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 4,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     backgroundColor: '#151517',
//     borderRadius: 12,
//     gap: 6,
//     flex: 1,
//     marginHorizontal: 4,
//   },
//   saveButton: {
//     backgroundColor: '#8b5cf6',
//   },
//   saveText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '700',
//   },

//   // Drawing Area
//   drawingArea: {
//     flex: 1,
//     backgroundColor: '#1a1a1a',
//   },
//   svgContainer: {
//     flex: 1,
//   },

//   // Status Bar (Bottom)
//   statusBar: {
//     height: 40,
//     backgroundColor: '#0E0E10',
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255, 255, 255, 0.05)',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//   },
//   statusItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   currentColorIndicator: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   statusText: {
//     color: '#6B7280',
//     fontSize: 12,
//     fontWeight: '600',
//   },
// });


import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  PermissionsAndroid, // Android par permission ke liye
  Platform, // Platform check karne ke liye
  Linking, // Settings kholne ke liye
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ViewShot from "react-native-view-shot";
// import CameraRoll from '@react-native-camera-roll/camera-roll';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';


// Colors aur Brush sizes
const COLORS = ["#FFFFFF", "#f87171", "#a78bfa", "#34d399", "#fbbf24", "#60a5fa", "#ec4899"];
const BRUSH_SIZES = [
  { id: "small", size: 3, label: "S" },
  { id: "medium", size: 8, label: "M" },
  { id: "large", size: 15, label: "L" },
];

const { height, width } = Dimensions.get("window");

export default function Whiteboard() {
  const navigation = useNavigation();
  const viewShotRef = useRef();

  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState(BRUSH_SIZES[1].size);
  // permissionGranted state hata diya gaya hai, kyunki ab hum har baar check karenge

  // ===== Touch Events (No Change) =====
  const onTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const newPath = {
      segments: [`M${locationX.toFixed(2)},${locationY.toFixed(2)}`],
      color: currentColor,
      strokeWidth: currentStrokeWidth,
    };
    setCurrentPath(newPath);
  };

  const onTouchMove = (event) => {
    if (!currentPath) return;
    const { locationX, locationY } = event.nativeEvent;
    const newSegment = `L${locationX.toFixed(2)},${locationY.toFixed(2)}`;
    
    setCurrentPath(prev => ({
      ...prev,
      segments: [...prev.segments, newSegment],
    }));
  };

  const onTouchEnd = () => {
    if (currentPath) {
      setPaths([...paths, currentPath]);
    }
    setCurrentPath(null);
  };

  // ===== Undo (No Change) =====
  const onUndo = () => {
    if (paths.length > 0) {
      setPaths(paths.slice(0, -1));
    }
  };

  // ===== Clear All (No Change) =====
  const onClearAll = () => {
    Alert.alert(
      "Clear Canvas",
      "Are you sure you want to clear everything?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: () => {
            setPaths([]);
            setCurrentPath(null);
          }
        }
      ]
    );
  };

  // ===== Check & Request Permission (FIXED LOGIC) =====
  const checkAndRequestPermission = async () => {
    if (Platform.OS !== 'android') return true; // iOS ko permission ki zaroorat nahi

    try {
      const androidVersion = Platform.Version;
      let permission;

      // Android 13 (API 33) ya usse naye ke liye
      if (androidVersion >= 33) {
        permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      } else {
      // Android 12 (API 32) ya usse puraane ke liye
        permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      }

      // 1. Pehle check karo permission hai ya nahi
      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) {
        return true; // Permission pehle se hai, baar-baar mat poocho
      }

      // 2. Agar nahi hai, toh request karo
      const status = await PermissionsAndroid.request(
        permission,
        {
          title: "Storage Permission Required",
          message: "App needs access to save your drawings to gallery.",
          buttonPositive: "Allow",
          buttonNegative: "Deny"
        }
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true; // Permission mil gayi
      } 
      
      if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        // User ne "Don't ask again" select kiya
        Alert.alert(
          "Permission Required",
          "Storage permission is required to save drawings. Please enable it from Settings.",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Open Settings", 
              onPress: () => Linking.openSettings() // Settings page kholega
            }
          ]
        );
        return false;
      } 
      
      // Agar user ne "Deny" kiya
      Alert.alert("Permission Denied", "Cannot save drawing without storage permission.");
      return false;

    } catch (err) {
      console.error("Permission check error:", err);
      return false;
    }
  };

  // ===== Save Drawing (FIXED LOGIC) =====
  const onSave = async () => {
    try {
      // Check if there's anything to save
      if (paths.length === 0 && !currentPath) {
        Alert.alert("Nothing to Save", "Please draw something first!");
        return;
      }

      // Smart check: Hamesha permission check karo (lekin yeh ab smart hai)
      const hasPermission = await checkAndRequestPermission();
      if (!hasPermission) {
        return; // Agar permission nahi mili, toh ruk jao
      }

      // Capture screenshot
      const uri = await viewShotRef.current.capture();

      // Save to gallery
      // await CameraRoll.save(uri, { type: 'photo' });
      await CameraRoll.saveAsset(uri, {
        type: 'photo',
        album: 'Whiteboard'
      });

      
      Alert.alert(
        "Saved! ✅",
        "Your drawing has been saved to your gallery.",
        [{ text: "OK" }]
      );

    } catch (error) {
      console.error("Error saving drawing:", error);
      Alert.alert("Error", "Could not save drawing. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#050405" />
      
      {/* ===== Modern Header (No Change) ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: '#fff', fontSize: 24 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Whiteboard</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* ===== Toolbar at Top (No Change) ===== */}
      <View style={styles.toolbar}>
        {/* Color Palette */}
        <View style={styles.toolSection}>
          <Text style={styles.toolTitle}>Colors</Text>
          <View style={styles.colorPalette}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  currentColor === color && styles.colorActive
                ]}
                onPress={() => setCurrentColor(color)}
              >
                {currentColor === color && (
                  <Icon name="check" size={14} color={color === '#FFFFFF' ? '#000' : '#fff'} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Brush Sizes */}
        <View style={styles.toolSection}>
          <Text style={styles.toolTitle}>Brush</Text>
          <View style={styles.brushPalette}>
            {BRUSH_SIZES.map((brush) => (
              <TouchableOpacity
                key={brush.id}
                style={[
                  styles.brushOption,
                  currentStrokeWidth === brush.size && styles.brushActive
                ]}
                onPress={() => setCurrentStrokeWidth(brush.size)}
              >
                <Text style={[
                  styles.brushLabel,
                  currentStrokeWidth === brush.size && styles.brushLabelActive
                ]}>
                  {brush.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onUndo}
            disabled={paths.length === 0}
          >
            <Icon name="undo" size={20} color={paths.length === 0 ? '#555' : '#fff'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onClearAll}>
            <Icon name="delete-sweep" size={20} color="#ff6b6b" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={onSave}>
            <Icon name="content-save" size={20} color="#fff" />
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== Drawing Area (No Change) ===== */}
      <ViewShot 
        ref={viewShotRef} 
        options={{ format: 'png', quality: 1.0 }} 
        style={styles.drawingArea}
      >
        <View
          style={styles.svgContainer}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Svg height="100%" width="100%">
            {/* Previous paths */}
            {paths.map((path, index) => (
              <Path
                key={`path-${index}`}
                d={path.segments.join(' ')}
                stroke={path.color}
                strokeWidth={path.strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {/* Current path being drawn */}
            {currentPath && (
              <Path
                d={currentPath.segments.join(' ')}
                stroke={currentPath.color}
                strokeWidth={currentPath.strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </Svg>
        </View>
      </ViewShot>

      {/* ===== Status Info (Bottom) (No Change) ===== */}
      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <View style={[styles.currentColorIndicator, { backgroundColor: currentColor }]} />
          <Text style={styles.statusText}>
            {BRUSH_SIZES.find(b => b.size === currentStrokeWidth)?.label} Brush
          </Text>
        </View>
        <Text style={styles.statusText}>{paths.length} strokes</Text>
      </View>
    </SafeAreaView>
  );
}

// ===== Styles (No Change) =====
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#050405",
  },
  header: {
    height: 60,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0E0E10',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backBtn: {
    padding: 8,
    width: 50,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: -0.3,
  },

  // Toolbar (Top)
  toolbar: {
    backgroundColor: '#0E0E10',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    paddingBottom: 16,
  },
  toolSection: {
    marginBottom: 12,
  },
  toolTitle: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Colors
  colorPalette: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorActive: {
    borderColor: '#a78bfa',
    borderWidth: 3,
  },

  // Brushes
  brushPalette: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brushOption: {
    width: 44,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#151517',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  brushActive: {
    backgroundColor: '#a78bfa',
    borderColor: '#c4b5fd',
  },
  brushLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '700',
  },
  brushLabelActive: {
    color: '#fff',
  },

  // Actions
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#151517',
    borderRadius: 12,
    gap: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#8b5cf6',
  },
  saveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Drawing Area
  drawingArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  svgContainer: {
    flex: 1,
  },

  // Status Bar (Bottom)
  statusBar: {
    height: 40,
    backgroundColor: '#0E0E10',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentColorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
});

