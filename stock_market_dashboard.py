#1- data loading from Tadawul all share inex stocks in csv file
import os
import pandas as pd

old_path = r"C:\Users\hp\Downloads\^tasi_w (3).csv"
new_path = os.getcwd()
data_path = os.path.relpath(old_path, new_path)

df = pd.read_csv(data_path)
print(df.head())

#error handling 1 for reading the file
try:
    df = pd.read_csv(data_path)
except FileNotFoundError:
    print("The file wasn't found please enter it correctly")
    exit()
except Exception as e:
    print(f"There is error in csv file {e}")
    exit()

#1.2 data exploring and cleaningsss

df=pd.read_csv(data_path)
datacsv=df.head()
print(datacsv)
inform=df.info()
print(inform)
check_null=df.isnull().sum()
print(check_null)
check_duplicate=df.duplicated().sum()
print(check_duplicate)


#1.3 change the format of date to be as YYYY-MM-DD since it in wrong format also as object
df['Date'] = pd.to_datetime(df['Date'], errors='coerce')   #coerce for making (not in the write format) عشان اعرفه واصححه
df.info()

#error handling 2 for converting date column
try:
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    if df['Date'].isnull().any():
        print("The format of date is not correct")
        df = df.dropna(subset=['Date'])
except Exception as e:
    print(f"There is error in convert the date format {e}")

print(df['Date'].head()) #to check up if it change or not from object to date

#1.4 since we dont have company name we should add it

df['Company'] = 'TASI'
df.to_csv('stock_with_company.csv', index=False) 
print("Column 'Company' has been added ") #with the updated version

#1.5 Sort the data based on the date 
df.sort_values(by="Date")
df.head()
#1.6 check if their is any outlier 
the_realcopy=df.copy()
outlier_look=df[(df['Open']>0) & (df['High']>0) & (df['Close']>0) & (df['Volume']>0) & (df['Low']>0)] #in term of numbers we dont want negative values 
print(outlier_look)

print(len(the_realcopy))
print(len(outlier_look)) #to compare between them and see how does it actually differe?

#1.7 add new column is daily change to cacluate it
daily_change=[0]
for i in range(1,len(df)):
    old=df.iloc[i-1]['Close'] #old {like one step behind to be subtracted}
    new=df.iloc[i]['Close'] #current
    change=((new-old)/old)*100
    daily_change.append(change)
df['Daily_change']=daily_change
print(df)

# error handling 3 for caculating daily change
try:
    daily_change = [0]
    for i in range(1, len(df)):
        old = df.iloc[i-1]['Close']
        new = df.iloc[i]['Close']
        if old != 0:
            change = ((new - old) / old) * 100
        else:
            change = 0
        daily_change.append(change)
    df['Daily_change'] = daily_change
except Exception as e:
    print(f"The error happens in caclulating the daily change {e}")


#2-organize the columns
df = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Daily_change','Company']]
#To save the cleaned file
path_cleaning = r"C:\Users\hp\Downloads\Cleaned_stock_data.csv"
data_cleaned = os.getcwd()
data_path = os.path.relpath(path_cleaning, data_cleaned)
df = pd.read_csv(data_path,parse_dates=['Date'])
print(df.head())
df.to_csv("Cleaned_stock_data.csv", index=False)
#eror handling 4 for saving file
try:
    df.to_csv('Cleaned_stock_data.csv', index=False)
except Exception as e:
    print(f"There is error while saving cleansed data  {e}")

#3-Statics measures

#Calculate statistical metrics for the company
The_mean = df['Close'].mean()
The_median = df['Close'].median()
The_maximum = df['Close'].max()
The_minimum = df['Close'].min()
The_standard_deviation = df['Close'].std()


#Print and show the results
print("The statical measure we have for TASI company as following ")
print(f"The mean in closing column we have is {The_mean:.1f}")
print(f"The median  in median column we have is {The_median:.1f}")
print(f"The highest number in closing price we have {The_maximum:.1f}")
print(f"The lowest number we have in closing column {The_minimum:.1f}")
print(f"The standard deviation in closing column {The_standard_deviation:.1f}")



#4- Data plotting and visualization
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

#4.1 Line plot: Closing price vs. time and implementing the error handle
try: 
    plt.figure(figsize=(16,5))
    plt.plot(df['Date'],df['Close'],color='green')
    plt.title('Line plot')
    plt.xlabel('Date')
    plt.ylabel('Closing Price')
    plt.gca().xaxis.set_major_locator(mdates.MonthLocator()) #force to show all months
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%b %Y')) # to make the format as "Jan 2024"
    plt.tight_layout() #Prevent label overlap
    plt.savefig('line_plot.png')
    plt.grid(True)
    plt.show()
    plt.close()
except KeyError as e:
    print(f"There is no column: {e}")
except Exception as e:
    print(f"Error happen in plotting: {e}")

#4.2 Histogram: Distribution of daily percentage changes in stock prices
plt.figure(figsize=(10,6))
plt.hist(df['Daily_change'],bins=20,color='blue',edgecolor='black',alpha=0.7)
plt.title('Histogram')
plt.xlabel('Daily Percentage Change %')
plt.ylabel('Frequency')
plt.grid(True)
plt.savefig('hist.png') #seve them in python folder as png photo
plt.show()
plt.close()


#4.3 Box plot: Visualize quartlies of closing price
plt.figure(figsize=(8,6))
plt.boxplot(df['Close'])
plt.title('Box Plot')
plt.ylabel('Closing Price')
plt.grid(True)
plt.savefig('boxplot.png')
plt.show()
plt.close()

#4.4 Scatter plot: Correlation between trading volume and closing price
plt.figure(figsize=(11,6))
plt.scatter(df['Volume'],df['Close'],color='red',alpha=0.5)
plt.title('Scatter Plot')
plt.xlabel('Trading Volume')
plt.ylabel('Closing Price')
plt.grid(True)
plt.savefig('scatter.png')
plt.show()
plt.close()

#4.5 intercative chart on line chart and histogram
import plotly.express as px
df = pd.read_csv("Cleaned_stock_data.csv", parse_dates=['Date'])
fig = px.line(df, x='Date', y='Close', title='The interactive close price with time ') #interactive line chart
fig.show()
df = pd.read_csv("Cleaned_stock_data.csv")
fig = px.histogram(df, x='Daily_change', nbins=25, title='The interactive histogram in daily change ') 
fig.show()


#4.6 Implementing trend analysis to identify long-term price trends

try:
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    if df['Date'].isnull().any():
        print("Incorrect date will not be printed ")
        df = df.dropna(subset=['Date'])
except Exception as e:
    print(f"The error tha happen in term of change 'Date' is column: {e}")

try:
    df['Movingavg10'] = df['Close'].rolling(window=10).mean().bfill()
    df['Movingavg30'] = df['Close'].rolling(window=30).mean().bfill()
except Exception as e:
    print(f"Error related to moving averages is : {e}")

try:
    plt.figure(figsize=(14, 5))
    plt.plot(df['Date'], df['Close'], label='Current value of close price', alpha=0.6, linewidth=2)
    plt.plot(df['Date'], df['Movingavg10'], label='10-Day Moving Avg', linestyle='--', linewidth=2)
    plt.plot(df['Date'], df['Movingavg30'], label='30-Day Moving Avg', linestyle='-.', linewidth=2)

    plt.title('Trend Analysis with Moving Avg ')
    plt.xlabel('Date')
    plt.ylabel('Price')
    plt.legend(loc='best', fontsize=12)
    plt.gca().xaxis.set_major_locator(mdates.MonthLocator(interval=2))
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
    plt.gcf().autofmt_xdate()
    plt.tight_layout()
    plt.grid(True)
    plt.show()
    plt.savefig('trend_analyze_ma.png')
    plt.close()
except Exception as e:
    print(f"Error in term  plotting them as charts {e}")

#5- Allow users to select specific time for analyzing it

Begin_date=input("Enter a beginning date you want in this format (YYYY-MM-DD)? ")
Finish_date=input("Enter finishing date you want in this format (YYYY-MM-DD)? ")

specific_time= df[(df['Date'] >= Begin_date) & (df['Date'] <= Finish_date)]
specific_time.to_csv('The_data_filtered.csv', index=False)
print("a specific date you want has been saved as The_data_filtered.csv") 


    
