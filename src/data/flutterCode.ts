export interface StudentData {
  name: string;
  course: string;
  id: string;
  semester: string;
  department: string;
  email: string;
  photoUrl: string;
}

export const initialStudent: StudentData = {
  name: "Samantha Vance",
  course: "B.Sc. Computer Science & Software Engineering",
  id: "CS-2024-0492",
  semester: "Semester 5 (Fall 2024)",
  department: "School of Computing & Data Sciences",
  email: "samantha.vance@university.edu",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
};

export const sampleAvatars = [
  {
    name: "Samantha Vance",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    course: "B.Sc. Computer Science & Software Engineering",
  },
  {
    name: "Alex Rivera",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80",
    course: "B.Tech. Artificial Intelligence & Robotics",
  },
  {
    name: "Priya Sharma",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
    course: "B.Eng. Mechanical & Mechatronics Systems",
  },
  {
    name: "Marcus Chen",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    course: "B.S. Information Systems & Cybersecurity",
  },
];

export const generateFlutterDartCode = (
  studentName: string = "Samantha Vance",
  studentCourse: string = "B.Sc. Computer Science & Software Engineering",
  photoUrl: string = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
) => `import 'package:flutter/material.dart';

void main() {
  runApp(const StudentProfileApp());
}

/// Root Application Widget
class StudentProfileApp extends StatelessWidget {
  const StudentProfileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Student Profile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.light,
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.dark,
        ),
      ),
      home: const StudentProfileScreen(),
    );
  }
}

/// =========================================================================
/// SCREEN 1: Student Profile Screen
/// Displays: Scaffold, AppBar, Column, CircleAvatar, Text, and ElevatedButton
/// =========================================================================
class StudentProfileScreen extends StatefulWidget {
  const StudentProfileScreen({super.key});

  @override
  State<StudentProfileScreen> createState() => _StudentProfileScreenState();
}

class _StudentProfileScreenState extends State<StudentProfileScreen> {
  // State variable holding the student's name
  String _studentName = '${studentName}';
  final String _studentCourse = '${studentCourse}';
  final String _photoUrl = '${photoUrl}';

  /// Navigates to Screen 2 (EditProfileScreen) and awaits the returned value
  Future<void> _navigateToEditScreen() async {
    // Navigator.push returns a Future that completes when Navigator.pop is called in Screen 2
    final updatedName = await Navigator.push<String>(
      context,
      MaterialPageRoute(
        builder: (context) => EditProfileScreen(currentName: _studentName),
      ),
    );

    // If a new name was returned (not null and not empty), update state
    if (updatedName != null && updatedName.trim().isNotEmpty && mounted) {
      setState(() {
        _studentName = updatedName.trim();
      });

      // Show feedback SnackBar confirming the update
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Student name updated to "$_studentName"'),
          backgroundColor: Theme.of(context).colorScheme.primary,
          behavior: SnackBarBehavior.floating,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Student Profile',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        elevation: 2,
        backgroundColor: theme.colorScheme.surfaceVariant,
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // 1. CircleAvatar Widget displaying the student's photo
                CircleAvatar(
                  radius: 64,
                  backgroundColor: theme.colorScheme.primaryContainer,
                  backgroundImage: NetworkImage(_photoUrl),
                  // Fallback icon if the network image fails to load
                  child: _photoUrl.isEmpty
                      ? Icon(
                          Icons.person,
                          size: 64,
                          color: theme.colorScheme.onPrimaryContainer,
                        )
                      : null,
                ),
                const SizedBox(height: 24),

                // 2. Text Widget displaying Student Name
                Text(
                  _studentName,
                  textAlign: TextAlign.center,
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 8),

                // 3. Text Widget displaying Student Course
                Text(
                  _studentCourse,
                  textAlign: TextAlign.center,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 36),

                // 4. ElevatedButton Widget navigating to Screen 2
                ElevatedButton.icon(
                  onPressed: _navigateToEditScreen,
                  icon: const Icon(Icons.edit_outlined),
                  label: const Text(
                    'Edit Student Name',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 32,
                      vertical: 14,
                    ),
                    elevation: 3,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// =========================================================================
/// SCREEN 2: Edit Profile Screen
/// Allows editing the name using TextField and passes it back using Navigator.pop
/// =========================================================================
class EditProfileScreen extends StatefulWidget {
  final String currentName;

  const EditProfileScreen({
    super.key,
    required this.currentName,
  });

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  // Controller to read and manage the text in the TextField
  late final TextEditingController _nameController;
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    // Initialize controller with current name received from Screen 1
    _nameController = TextEditingController(text: widget.currentName);
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  /// Validates and returns the updated name to Screen 1 via Navigator.pop
  void _saveAndReturn() {
    if (_formKey.currentState?.validate() ?? false) {
      final updatedName = _nameController.text.trim();
      // Navigator.pop returns the value back to the Navigator.push caller in Screen 1
      Navigator.pop(context, updatedName);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Edit Profile',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Update Student Details',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Enter the revised student name below. Changes will be reflected immediately on the profile screen.',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 24),

                // TextField Widget to edit student's name
                TextFormField(
                  controller: _nameController,
                  autofocus: true,
                  textCapitalization: TextCapitalization.words,
                  decoration: InputDecoration(
                    labelText: 'Student Name',
                    hintText: 'e.g. John Doe',
                    prefixIcon: const Icon(Icons.person_outline),
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () => _nameController.clear(),
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    filled: true,
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter a valid student name';
                    }
                    if (value.trim().length < 2) {
                      return 'Name must be at least 2 characters long';
                    }
                    return null;
                  },
                  onFieldSubmitted: (_) => _saveAndReturn(),
                ),
                const SizedBox(height: 32),

                // ElevatedButton Widget to save and pass data back
                ElevatedButton.icon(
                  onPressed: _saveAndReturn,
                  icon: const Icon(Icons.check_circle_outline),
                  label: const Text(
                    'Save Changes',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: theme.colorScheme.primary,
                    foregroundColor: theme.colorScheme.onPrimary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Optional Cancel Button
                OutlinedButton(
                  onPressed: () => Navigator.pop(context),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text('Cancel'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
`;

export const pubspecYamlContent = `name: student_profile_app
description: "A Flutter application demonstrating a two-screen student profile with Navigator data passing."
publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`;
