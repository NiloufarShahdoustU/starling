% Parameters
minVal = 1;
maxVal = 11;
skew = 1.8;  % Adjust this for different skewness

% Generate 150 random pairs
randomNumbers1 = zeros(150, 1);
randomNumbers2 = zeros(150, 1);

for i = 1:150
    randomNumbers1(i) = getSkewedRandom(minVal, maxVal, skew);
    randomNumbers2(i) = getSkewedRandom(minVal, maxVal, skew);
end

% Plotting
figure;

% Subplot for Random Numbers 1
subplot(2, 1, 1);
histogram(randomNumbers1, 'BinEdges', 0.5:1:11.5, 'Normalization', 'pdf');

title('PDF of Random Numbers 1');
xlabel('Value');
ylabel('Probability Density');
grid on;

% Subplot for Random Numbers 2
subplot(2, 1, 2);
histogram(randomNumbers2, 'BinEdges', 0.5:1:11.5, 'Normalization', 'pdf');   

title('PDF of Random Numbers 2');
xlabel('Value');
ylabel('Probability Density');
grid on;

% Count of samples within the range [1, 11]
count1 = histcounts(randomNumbers1, 1:12);
count2 = histcounts(randomNumbers2, 1:12);
