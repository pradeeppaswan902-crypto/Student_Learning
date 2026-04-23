# 📋 Assignment Module - Complete Implementation Guide

## Overview
The Assignment Module is a comprehensive system for managing course assignments with submission tracking, deadline management, and evaluation capabilities.

## Key Features

### 1. **Assignment Management**
- View all course assignments with deadline information
- Track submission status in real-time
- Auto-detect overdue assignments
- Days remaining counter for upcoming deadlines

### 2. **Submission Types**
Each assignment supports multiple submission methods:
- **📄 File Upload**: Upload assignment files via URL/path
- **📝 Text Input**: Write assignment content directly
- **🔗 External Link**: Submit link to external resources (GitHub, Drive, etc.)

### 3. **Status Tracking**
Real-time submission status updates:
- **Not Submitted** (gray) - No submission yet
- **Submitted** (green) - Submitted before deadline
- **Late Submitted** (yellow) - Submitted after deadline
- **Evaluated** (blue) - Instructor feedback received
- **Overdue** (red) - Past deadline without submission

### 4. **Deadline Management**
- Color-coded deadline indicators
- Auto-prevent submissions after deadline
- Late submission flag with warning
- Days remaining counter

### 5. **Evaluation System**
After submission, instructors can:
- Award marks (0-100)
- Provide detailed feedback
- Timestamp evaluation
- Display results to students

## How to Use

### Student View

#### Step 1: View Assignments
1. Click on **"Assignments"** in the sidebar
2. You'll see a list of all assignments with:
   - Assignment title
   - Description (truncated)
   - Deadline and days remaining
   - Current submission status
   - Score (if evaluated)

#### Step 2: View Assignment Details
1. Click **"View Details"** on any assignment
2. You'll see:
   - Full assignment description
   - Allowed submission types
   - Your current submission (if any)
   - Evaluation results (if evaluated)

#### Step 3: Submit Assignment
1. If not submitted, select submission type:
   - For **Text**: Type content in the text area
   - For **File/Link**: Enter the URL or file path
2. Click **"Submit Assignment"**
3. **Real-time Update**: Status changes immediately without page reload
4. Toast notification confirms submission

#### Step 4: View Evaluation
Once your assignment is evaluated:
1. You'll see an **"Evaluation Results"** section with:
   - **Marks Awarded**: Your score out of 100
   - **Evaluated At**: When instructor graded it
   - **Instructor Feedback**: Detailed comments

#### Step 5: Demo Evaluation (Testing)
1. Submit an assignment (use dummy content)
2. Click **"Simulate Evaluation (Demo)"** button
3. System will:
   - Generate random marks (70-95)
   - Add instructor feedback
   - Update status to "Evaluated"
   - Display results immediately

### Key UI Elements

#### Assignment Card
```
┌─────────────────────────────────────────┐
│ Assignment Title                        │
├─────────────────────────────────────────┤
│ Description...                          │
│                                         │
│ 📅 Deadline: Apr 30, 2026              │
│ ⏱️ 5 days left                          │
│ ✓ Submitted: Apr 28, 2026              │
│                                         │
│ [Submitted] [View Details]              │
└─────────────────────────────────────────┘
```

#### Status Indicators
- 🔴 **Overdue**: Assignment past deadline
- 🟡 **Late**: Submitted after deadline
- 🟢 **Submitted**: On-time submission
- 🔵 **Evaluated**: Graded with feedback
- ⚠️ **Late**: Warning flag for late submissions
- ⭐ **Score**: Shows marks awarded

## Real-Time Features

### Instant Updates
✅ Submission reflects immediately in assignment list
✅ Status changes without page refresh
✅ Progress counters update live
✅ Evaluation results appear instantly

### Automatic Detection
✅ Late submission flagging
✅ Deadline comparison (past/upcoming)
✅ Overdue prevention
✅ Status transitions

## Database Fields

### Assignment Model
```javascript
{
  title: String,              // Assignment name
  description: String,        // Full assignment details
  deadline: Date,             // Due date/time
  submissionTypes: [String],  // ['file', 'text', 'link']
  submissions: [{             // Array of student submissions
    student: ObjectId,
    submissionType: String,
    content: String,          // Text, path, or URL
    submittedAt: Date,
    isLate: Boolean,
    status: String,           // submitted/late_submitted/evaluated
    marks: Number,            // 0-100
    feedback: String,         // Instructor comments
    evaluatedAt: Date
  }],
  createdAt: Date
}
```

## API Endpoints

### Get All Assignments
```
GET /api/assignments
Response: [{ _id, title, description, deadline, status, marks, ... }]
```

### Get Assignment Details
```
GET /api/assignments/:assignmentId
Response: { _id, title, description, deadline, userSubmission: {...} }
```

### Submit Assignment
```
POST /api/assignments/:assignmentId/submit
Body: { submissionType: 'text'|'file'|'link', content: String }
Response: { success: true, isLate: Boolean, status: String, submittedAt: Date }
```

### Evaluate Assignment (Instructor/Demo)
```
POST /api/assignments/:assignmentId/evaluate
Body: { studentId: String, marks: Number, feedback: String }
Response: { success: true, marks, feedback }
```

## Example Workflow

### Scenario 1: On-Time Submission
```
1. Student views "React Component Assignment" (Due: Apr 30)
2. Clicks "View Details"
3. Selects submission type: "Text Input"
4. Writes component code
5. Clicks "Submit Assignment"
   ✅ Status → "Submitted" (green)
   ✅ List updates immediately
6. Instructor simulates evaluation:
   ✅ Marks: 85/100
   ✅ Feedback: "Great work!"
   ✅ Status → "Evaluated" (blue)
   ✅ Results visible to student
```

### Scenario 2: Late Submission
```
1. Assignment deadline: Apr 25 (passed)
2. Student tries to submit
   ❌ Form disabled with message: "Submission Closed"
   ✅ Unless already has late submission allowed
3. If late submission allowed:
   ⚠️ Status → "Late Submitted" (yellow)
   ⚠️ Late flag visible in list
```

## Troubleshooting

### Issue: Submission not appearing
- **Check**: Is the form validated (not empty)?
- **Check**: Did you select a submission type?
- **Check**: Is the deadline past (if showing "Submission Closed")?
- **Console**: Check browser console (F12) for error messages

### Issue: Status not updating
- **Check**: Did you see the success toast notification?
- **Check**: Is the server running (check backend terminal)?
- **Console**: Check server logs for submission debug info

### Issue: Evaluation button not working
- **Check**: Has the assignment been submitted first?
- **Check**: Is status "Submitted" or "Late Submitted"?
- **Try**: Refresh page if button appears disabled

## Console Debug Logs

### Frontend Logs (Browser F12)
```
✅ Assignments fetched: [...]
✅ Assignment details fetched: {...}
📤 Submitting assignment: {...}
✅ Submission successful: {...}
🎯 Simulating evaluation: {...}
✅ Evaluation successful: {...}
```

### Backend Logs (Server Terminal)
```
=== Assignment Submission ===
Assignment ID: 5f7a...
Student ID: 5f8b...
Submission Type: text
Is Late: false
Status: submitted
✅ Submission saved successfully

=== Assignment Evaluated ===
Marks: 85
Feedback: "Excellent work!"
```

## Tips & Best Practices

1. **Submit Early**: Avoid last-minute submissions to allow time for evaluation
2. **Use Descriptive Content**: Provide clear code/content for better evaluation
3. **Check Deadlines**: Monitor days remaining to avoid missing deadlines
4. **Review Feedback**: Check evaluation feedback to improve future submissions
5. **Use Appropriate Type**: Choose submission type that best fits your content

## Demo Data

The system comes with pre-seeded assignments:
- **React Component Development** - Due Apr 30 (Evaluated: 85/100)
- **JavaScript Algorithm Implementation** - Due May 5 (Not Submitted)
- **Python Data Analysis Project** - Due May 10 (Not Submitted)
- **Database Design Assignment** - Due Apr 25 (Late Submitted: 78/100)

## Advanced Features

### Submission Resubmission
✅ Students can resubmit multiple times
✅ Previous submission is replaced
✅ Latest submission timestamp recorded

### Late Submission Tracking
✅ Automatic late flag based on deadline
✅ Visual warning in UI
✅ Separate status for late submissions

### Comprehensive Evaluation
✅ Marks on 0-100 scale
✅ Free-form feedback text
✅ Timestamp of evaluation
✅ All data persisted in database

## Future Enhancements

- [ ] Bulk evaluation for instructors
- [ ] Assignment rubrics
- [ ] File upload with virus scanning
- [ ] Plagiarism detection
- [ ] Assignment groups/categories
- [ ] Resubmission deadlines
- [ ] Email notifications
- [ ] Analytics dashboard for instructors

## Support

For issues or questions:
1. Check browser console for error messages
2. Check server terminal for backend errors
3. Review this guide for troubleshooting section
4. Test with demo evaluation button first

---

**Last Updated**: April 21, 2026
**Version**: 1.0 - Complete Implementation
